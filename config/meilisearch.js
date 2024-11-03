const { MeiliSearch } = require('meilisearch');

const meilisearchConfig = {
  development: {
    host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
    apiKey: process.env.MEILISEARCH_API_KEY || 'masterKey',
    options: {
      requestTimeout: 5000
    }
  },
  test: {
    host: process.env.MEILISEARCH_TEST_HOST || 'http://localhost:7700',
    apiKey: process.env.MEILISEARCH_TEST_API_KEY || 'masterKey',
    options: {
      requestTimeout: 5000
    }
  },
  production: {
    host: process.env.MEILISEARCH_HOST,
    apiKey: process.env.MEILISEARCH_API_KEY,
    options: {
      requestTimeout: 10000
    }
  }
};

class MeiliSearchClient {
  constructor() {
    this.client = null;
    this.indices = new Map();
  }

  async initialize() {
    try {
      const env = process.env.NODE_ENV || 'development';
      const config = meilisearchConfig[env];

      if (!this.client) {
        this.client = new MeiliSearch({
          host: config.host,
          apiKey: config.apiKey,
          ...config.options
        });

        // 初始化常用索引配置
        await this.setupIndices();
      }

      return this.client;
    } catch (error) {
      console.error('MeiliSearch initialization error:', error);
      throw error;
    }
  }

  async setupIndices() {
    try {
      const mediaIndex = this.client.index('media');
      await mediaIndex.updateSettings({
        searchableAttributes: [
          'translations.*.title',
          'translations.*.description',
          'tags'
        ],
        filterableAttributes: [
          'mediaType',
          'releaseDate'
        ],
        sortableAttributes: [
          'releaseDate',
          'averageRating'
        ]
      });
      this.indices.set('media', mediaIndex);

      // 角色索引
      const characterIndex = this.client.index('characters');
      await characterIndex.updateSettings({
        searchableAttributes: [
          'translations.*.name',
          'translations.*.description'
        ]
      });
      this.indices.set('characters', characterIndex);

      // 标签索引配置
      const tagIndex = await this.client.getOrCreateIndex('tags', { primaryKey: '_id' });
      await tagIndex.updateSettings({
        searchableAttributes: [
          'translations.*.name',
          'translations.*.description',
          'slug'
        ],
        filterableAttributes: [
          'type',
          'status',
          'isOfficial'
        ],
        sortableAttributes: [
          'usageCount',
          'createdAt'
        ]
      });
      this.indices.set('tags', tagIndex);

    } catch (error) {
      console.error('Error setting up indices:', error);
      throw error;
    }
  }

  async getIndex(indexName) {
    if (!this.indices.has(indexName)) {
      const index = await this.client.getIndex(indexName);
      this.indices.set(indexName, index);
    }
    return this.indices.get(indexName);
  }

  // 健康检查
  async healthCheck() {
    try {
      const health = await this.client.health();
      return {
        status: health.status,
        message: 'MeiliSearch is healthy'
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  // 数据同步方法
  async syncData(indexName, documents) {
    try {
      const index = await this.getIndex(indexName);
      const result = await index.addDocuments(documents);
      return result;
    } catch (error) {
      console.error(`Error syncing data to ${indexName}:`, error);
      throw error;
    }
  }

  // 搜索方法
  async search(indexName, query, options = {}) {
    try {
      const index = await this.getIndex(indexName);
      return await index.search(query, options);
    } catch (error) {
      console.error(`Search error in ${indexName}:`, error);
      throw error;
    }
  }

  // 删除文档
  async deleteDocument(indexName, documentId) {
    try {
      const index = await this.getIndex(indexName);
      return await index.deleteDocument(documentId);
    } catch (error) {
      console.error(`Error deleting document from ${indexName}:`, error);
      throw error;
    }
  }

  // 批量更新
  async updateDocuments(indexName, documents) {
    try {
      const index = await this.getIndex(indexName);
      return await index.updateDocuments(documents);
    } catch (error) {
      console.error(`Error updating documents in ${indexName}:`, error);
      throw error;
    }
  }
}

module.exports = new MeiliSearchClient();