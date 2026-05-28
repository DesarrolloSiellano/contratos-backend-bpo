import { Repository } from 'typeorm';
import { TenantContext } from './tenant.context';

export function patchTypeORMRepository() {
  const originalFind = Repository.prototype.find;
  const originalFindAndCount = Repository.prototype.findAndCount;
  const originalFindOne = Repository.prototype.findOne;
  const originalCount = Repository.prototype.count;

  function applyTenantFilter(metadata: any, options: any): any {
    const store = TenantContext.getStore();
    if (!store || store.isSuperAdmin) {
      return options;
    }

    if (!metadata) {
      return options;
    }

    const hasCompany = metadata.findColumnWithPropertyName('company');
    const hasTenantId = metadata.findColumnWithPropertyName('tenantId');

    if (!hasCompany && !hasTenantId) {
      return options;
    }

    const tenantFilter: any = {};
    if (hasCompany) tenantFilter.company = store.company;
    if (hasTenantId) tenantFilter.tenantId = store.tenantId;

    const newOptions = options ? { ...options } : {};

    if (!newOptions.where) {
      newOptions.where = tenantFilter;
    } else if (Array.isArray(newOptions.where)) {
      newOptions.where = newOptions.where.map((cond: any) => ({
        ...cond,
        ...tenantFilter,
      }));
    } else {
      newOptions.where = {
        ...newOptions.where,
        ...tenantFilter,
      };
    }

    return newOptions;
  }

  Repository.prototype.find = function (options?: any) {
    const filteredOptions = applyTenantFilter(this.metadata, options);
    return originalFind.call(this, filteredOptions);
  };

  Repository.prototype.findAndCount = function (options?: any) {
    const filteredOptions = applyTenantFilter(this.metadata, options);
    return originalFindAndCount.call(this, filteredOptions);
  };

  Repository.prototype.findOne = function (options?: any) {
    const filteredOptions = applyTenantFilter(this.metadata, options);
    return originalFindOne.call(this, filteredOptions);
  };

  Repository.prototype.count = function (options?: any) {
    const filteredOptions = applyTenantFilter(this.metadata, options);
    return originalCount.call(this, filteredOptions);
  };
}
