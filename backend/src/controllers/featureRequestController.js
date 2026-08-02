const { fn, col } = require('sequelize');
const {
  FeatureRequest, FeatureRequestVote, User, Company,
} = require('../models');

/** Every authenticated user (any company, any role) sees the same list, sorted by vote count. */
async function list(req, res, next) {
  try {
    const requests = await FeatureRequest.findAll({
      include: [
        { model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName'] },
        { model: FeatureRequestVote, attributes: ['userId'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const shaped = requests.map((r) => {
      const votes = r.FeatureRequestVotes || [];
      return {
        id: r.id,
        title: r.title,
        description: r.description,
        status: r.status,
        statusNote: r.statusNote,
        createdByUserId: r.createdByUserId,
        createdByName: r.createdBy ? `${r.createdBy.firstName} ${r.createdBy.lastName}` : 'Someone',
        createdAt: r.createdAt,
        voteCount: votes.length,
        hasVoted: votes.some((v) => v.userId === req.user.id),
      };
    });

    // Sort by vote count desc, then newest first - the whole point of the
    // board is surfacing what genuinely has the most cross-customer demand.
    shaped.sort((a, b) => b.voteCount - a.voteCount || new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ requests: shaped });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { title, description } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'A title is required' });
    if (title.length > 200) return res.status(400).json({ error: 'Title is too long (200 character max)' });
    if (description && description.length > 2000) return res.status(400).json({ error: 'Description is too long (2000 character max)' });

    const request = await FeatureRequest.create({
      title: title.trim(),
      description: description?.trim() || null,
      createdByUserId: req.user.id,
      createdByCompanyId: req.companyId || null,
    });

    // The requester's own vote is implicit - they clearly want it.
    await FeatureRequestVote.create({ featureRequestId: request.id, userId: req.user.id });

    res.status(201).json({ request });
  } catch (err) { next(err); }
}

/** Toggles the current user's vote on a request - one vote per user, added or removed. */
async function toggleVote(req, res, next) {
  try {
    const request = await FeatureRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const existing = await FeatureRequestVote.findOne({ where: { featureRequestId: request.id, userId: req.user.id } });
    if (existing) {
      await existing.destroy();
      const voteCount = await FeatureRequestVote.count({ where: { featureRequestId: request.id } });
      return res.json({ voted: false, voteCount });
    }
    await FeatureRequestVote.create({ featureRequestId: request.id, userId: req.user.id });
    const voteCount = await FeatureRequestVote.count({ where: { featureRequestId: request.id } });
    res.json({ voted: true, voteCount });
  } catch (err) { next(err); }
}

/** Super Admin: move a request through its lifecycle (open -> planned/in_progress/completed/declined). */
async function updateStatus(req, res, next) {
  try {
    const request = await FeatureRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    const { status, statusNote } = req.body;
    const allowed = ['open', 'planned', 'in_progress', 'completed', 'declined'];
    if (status && !allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    if (status) request.status = status;
    if (statusNote !== undefined) request.statusNote = statusNote;
    await request.save();
    res.json({ request });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const request = await FeatureRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    // A Super Admin can remove anything (spam/duplicates); the original
    // author can remove their own request only while it's still fresh
    // (still 'open', so no one's relying on a decision already made about it).
    const isOwner = request.createdByUserId === req.user.id && request.status === 'open';
    if (req.user.role !== 'super_admin' && !isOwner) {
      return res.status(403).json({ error: 'Not authorized to remove this request' });
    }
    await request.destroy();
    res.json({ message: 'Request removed' });
  } catch (err) { next(err); }
}

module.exports = { list, create, toggleVote, updateStatus, remove };
