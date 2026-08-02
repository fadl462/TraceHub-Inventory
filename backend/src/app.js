require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const customFieldRoutes = require('./routes/customFieldRoutes');
const assetRoutes = require('./routes/assetRoutes');
const locationRoutes = require('./routes/locationRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const billingRoutes = require('./routes/billingRoutes');
const planRoutes = require('./routes/planRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const companyRoutes = require('./routes/companyRoutes');
const siteContentRoutes = require('./routes/siteContentRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const faqRoutes = require('./routes/faqRoutes');
const footerLinkRoutes = require('./routes/footerLinkRoutes');
const cmsPageRoutes = require('./routes/cmsPageRoutes');
const couponRoutes = require('./routes/couponRoutes');
const platformSettingsRoutes = require('./routes/platformSettingsRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL, process.env.ADMIN_CLIENT_URL].filter(Boolean),
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

const globalLimiter = rateLimit({
  windowMs: (Number(process.env.RATE_LIMIT_WINDOW_MIN) || 15) * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 300,
});
app.use('/api', globalLimiter);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'TraceHub Inventory API', time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/custom-fields', customFieldRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/fx-rate', require('./routes/fxRoutes'));
app.use('/api/notifications', notificationRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/site-content', siteContentRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/footer-links', footerLinkRoutes);
app.use('/api/cms-pages', cmsPageRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/platform-settings', platformSettingsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/blog-posts', require('./routes/blogPostRoutes'));
app.use('/api/docs', require('./routes/docArticleRoutes'));
app.use('/api/feature-requests', require('./routes/featureRequestRoutes'));
app.use('/api/disposal-cases', require('./routes/disposalCaseRoutes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
