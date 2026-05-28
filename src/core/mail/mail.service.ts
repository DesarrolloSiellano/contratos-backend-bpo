import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { TenantContext } from '../tenant/tenant.context';
import { EmailConfig, EmailConfigDocument } from './schemas/email-config.schema';
import { EmailOutbox, EmailOutboxDocument } from './schemas/email-outbox.schema';
import { EmailTemplate, EmailTemplateDocument } from './schemas/email-template.schema';

@Injectable()
export class MailService {
  private defaultTransporter: nodemailer.Transporter;

  // Fallbacks de plantillas en caso de no estar configuradas en la base de datos
  private readonly defaultTemplates: Record<string, { subject: string; htmlContent: string }> = {
    welcome: {
      subject: 'Bienvenido a SIISWEB Contratos {{contratistaName}}',
      htmlContent: `
        <h2>¡Bienvenido al sistema de contratos SIISWEB!</h2>
        <p>Estimado/a contratista <strong>{{contratistaName}}</strong>, su cuenta de contratista ha sido aprovisionada con éxito.</p>
        <p>Sus credenciales provisionales de acceso al sistema central son:</p>
        <ul>
          <li><strong>Usuario:</strong> {{username}}</li>
          <li><strong>Contraseña temporal:</strong> {{password}}</li>
        </ul>
        <p style="color: #d32f2f; font-weight: bold;">Importante: Se le sugiere de manera explícita actualizar su contraseña tras su primer inicio de sesión.</p>
      `,
    },
    reject: {
      subject: 'Alerta de Evidencia Rechazada - SIISWEB Contratos',
      htmlContent: `
        <h2>Notificación de Evidencia Rechazada</h2>
        <p>Estimado/a contratista <strong>{{contratistaName}}</strong>,</p>
        <p>El supervisor ha evaluado y <strong>RECHAZADO</strong> la evidencia cargada: <strong>{{filename}}</strong>.</p>
        <p><strong>Observaciones del supervisor:</strong> {{observaciones}}</p>
        <p style="color: #d32f2f; font-weight: bold;">Acción requerida: Corrija la evidencia en la plataforma lo antes posible para poder certificar el periodo.</p>
      `,
    },
    reject_alert: {
      subject: 'Alerta de Corrección: Evidencia lista para revisión',
      htmlContent: `
        <h3>Soporte Corregido</h3>
        <p>El contratista <strong>{{contratistaName}}</strong> ha cargado una versión corregida de la evidencia para el contrato <strong>{{numeroContrato}}</strong>.</p>
        <p><strong>Archivo anterior eliminado y reemplazado por:</strong> {{filename}}</p>
        <p>Por favor, ingrese a la plataforma para revisar y dictaminar el nuevo soporte.</p>
      `,
    },
    evaluation: {
      subject: 'Notificación de Calificación de Desempeño - SIISWEB',
      htmlContent: `
        <h2>Notificación de Calificación de Desempeño</h2>
        <p>Estimado/a contratista <strong>{{contratistaName}}</strong>,</p>
        <p>Se ha registrado o actualizado una evaluación sobre su desempeño del periodo <strong>{{periodoNumero}}</strong>.</p>
        <ul>
            <li><strong>Porcentaje Calificado:</strong> {{porcentajeCalificado}}%</li>
            <li><strong>Observaciones / Detalles:</strong> {{observaciones}}</li>
            <li><strong>Monto a liquidar en este periodo:</strong> \${{valorPeriodo}}</li>
        </ul>
      `,
    },
  };

  constructor(
    private readonly config: ConfigService,
    @InjectModel(EmailConfig.name) private readonly emailConfigModel: Model<EmailConfigDocument>,
    @InjectModel(EmailOutbox.name) private readonly emailOutboxModel: Model<EmailOutboxDocument>,
    @InjectModel(EmailTemplate.name) private readonly emailTemplateModel: Model<EmailTemplateDocument>,
  ) {
    // Configuración por defecto a partir de variables de entorno (.env)
    this.defaultTransporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST') || 'smtp.gmail.com',
      port: Number(this.config.get<number>('SMTP_PORT') || 587),
      secure: this.config.get<boolean>('SMTP_SECURE') || false,
      auth: {
        user: this.config.get<string>('SMTP_USER') || 'appsiellano@gmail.com',
        pass: this.config.get<string>('SMTP_PASS') || 'siellano2020',
      },
    });
  }

  /**
   * Obtiene la configuración SMTP dinámica del inquilino actual.
   * Si no tiene configuración activa, retorna la configuración por defecto de las variables de entorno.
   */
  private async getTransporterAndFrom(): Promise<{ transporter: nodemailer.Transporter; from: string; configEntity?: EmailConfig }> {
    const store = TenantContext.getStore();
    if (store) {
      try {
        const tenantConfig = await this.emailConfigModel.findOne({
          company: store.company,
          tenantId: store.tenantId,
          isActive: true,
        }).exec();

        if (tenantConfig) {
          const dynamicTransporter = nodemailer.createTransport({
            host: tenantConfig.host,
            port: tenantConfig.port,
            secure: tenantConfig.secure,
            auth: {
              user: tenantConfig.user,
              pass: tenantConfig.pass,
            },
          });
          const from = `"${tenantConfig.fromName}" <${tenantConfig.fromEmail}>`;
          return { transporter: dynamicTransporter, from, configEntity: tenantConfig };
        }
      } catch (err) {
        console.error('Error al cargar configuración SMTP dinámica:', err);
      }
    }

    const defaultFrom = this.config.get<string>('SMTP_FROM') || '"SIISWEB Contratos" <appsiellano@gmail.com>';
    return { transporter: this.defaultTransporter, from: defaultFrom };
  }

  /**
   * Reemplaza variables encerradas en doble llave {{ variable }} en un texto de plantilla.
   */
  private replacePlaceholders(text: string, variables: Record<string, string>): string {
    return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
      return variables[key] !== undefined ? variables[key] : `{{${key}}}`;
    });
  }

  /**
   * Envía un correo con una plantilla configurada y variables dinámicas.
   * Primero intenta buscar una plantilla personalizada para el inquilino en Mongoose.
   * Si no existe, utiliza la plantilla por defecto correspondiente al templateKey.
   */
  async sendMailWithTemplate(
    to: string,
    templateKey: string,
    variables: Record<string, string>,
  ): Promise<void> {
    const store = TenantContext.getStore();
    let templateSubject = '';
    let templateHtml = '';

    // 1. Intentar cargar plantilla de la base de datos Mongoose para el inquilino
    if (store) {
      try {
        const customTemplate = await this.emailTemplateModel.findOne({
          company: store.company,
          tenantId: store.tenantId,
          templateKey,
        }).exec();

        if (customTemplate) {
          templateSubject = customTemplate.subject;
          templateHtml = customTemplate.htmlContent;
        }
      } catch (err) {
        console.error('Error al cargar plantilla personalizada de Mongoose:', err);
      }
    }

    // 2. Si no se cargó plantilla personalizada, usar la por defecto
    if (!templateSubject || !templateHtml) {
      const defaultTemplate = this.defaultTemplates[templateKey];
      if (!defaultTemplate) {
        throw new InternalServerErrorException(`Plantilla de correo '${templateKey}' no soportada.`);
      }
      templateSubject = defaultTemplate.subject;
      templateHtml = defaultTemplate.htmlContent;
    }

    // 3. Reemplazar variables dinámicamente
    const finalSubject = this.replacePlaceholders(templateSubject, variables);
    const finalHtml = this.replacePlaceholders(templateHtml, variables);

    // 4. Delegar al método principal de envío para auditar en outbox
    await this.sendMail(to, finalSubject, finalHtml);
  }

  /**
   * Envía un correo electrónico de forma genérica.
   * Implementa auditoría en tiempo de ejecución (EmailOutbox) y transaccionalidad SMTP por inquilino.
   */
  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const store = TenantContext.getStore();
    const company = store?.company || 'default';
    const tenantId = store?.tenantId || 'default';

    const { transporter, from, configEntity } = await this.getTransporterAndFrom();

    // BR-Audit: Registrar el correo en el Outbox en estado pendiente (pending)
    const outboxRecord = new this.emailOutboxModel({
      to,
      subject,
      body: html,
      cc: configEntity?.cc || '',
      bcc: configEntity?.bcc || '',
      status: 'pending',
      company,
      tenantId,
    });
    
    await outboxRecord.save();

    try {
      await transporter.sendMail({
        from,
        to,
        subject,
        html,
        cc: configEntity?.cc || undefined,
        bcc: configEntity?.bcc || undefined,
      });

      // Si tiene éxito, actualizar estado a sent
      outboxRecord.status = 'sent';
      outboxRecord.sentAt = new Date();
      await outboxRecord.save();

      console.log(`[SMTP SUCCESS] Correo enviado y auditado exitosamente a ${to}`);
    } catch (error: any) {
      console.error('[SMTP FAIL] Fallo en el envío de correo:', error);

      // Si falla, actualizar estado a failed y guardar error
      outboxRecord.status = 'failed';
      outboxRecord.error = error.message || error.toString();
      await outboxRecord.save();

      throw new InternalServerErrorException(`Fallo al despachar correo electrónico: ${error.message}`);
    }
  }
}
