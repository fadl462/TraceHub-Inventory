const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define('BlogPost', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false },
    // Same slug is reused across languages (one row per locale) - the URL
    // stays identical regardless of which language is showing.
    locale: { type: DataTypes.STRING, allowNull: false, defaultValue: 'en' },
    excerpt: { type: DataTypes.STRING, allowNull: true },
    bodyHtml: { type: DataTypes.TEXT, allowNull: true },
    coverImageUrl: { type: DataTypes.STRING, allowNull: true },
    authorName: { type: DataTypes.STRING, defaultValue: 'TraceHub Team' },
    publishedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'blog_posts',
    timestamps: true,
    indexes: [{ unique: true, fields: ['slug', 'locale'] }],
  });

  return BlogPost;
};
