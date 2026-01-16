import Repository from './Repository';

type ListParams = {
  country?: string;
  parentId?: string;
  limit?: number;
  pageToken?: string;
};

class ServiceCategeoryRepository extends Repository {
  constructor() {
    super(''); // use root API base
  }

  /**
   * GET /service-categories-with-subcategories
   * Supports pagination and optional filters.
   */
  getServiceCategoriesWithSubcategories(params?: ListParams) {
    return this.get<any>(
      `/service-categories-with-subcategories${this.buildQuery({
        limit: 50,
        ...params,
      })}`,
    );
  }

  /**
   * GET /service-categories
   * Supports pagination and optional filters.
   */
  getServiceCategories(params?: ListParams) {
    return this.get<any>(
      `/service-categories${this.buildQuery({ limit: 50, ...params })}`,
    );
  }
}

export default new ServiceCategeoryRepository();
