const express = require('express');
const router = express.Router();
const { Job, Employer, JobTag, Application } = require('../models');

// GET all jobs
router.get('/', async (req, res) => {
  try {
    const { status, category, location } = req.query;
    const where = {};
    
    if (status) where.status = status;
    if (category) where.category = category;
    if (location) where.location = location;

    const jobs = await Job.findAll({
      where,
      include: [
        { model: Employer, attributes: ['id', 'name', 'logo_url'] },
        { model: JobTag, attributes: ['tag_name'] },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: jobs,
      count: jobs.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        { model: Employer, attributes: ['id', 'name', 'logo_url', 'website'] },
        { model: JobTag, attributes: ['tag_name'] },
        { 
          model: Application, 
          attributes: ['id', 'status', 'candidate_id'],
          include: [{ association: 'Candidate', attributes: ['id', 'title'] }]
        },
      ],
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    // Increment view count
    await job.increment('view_count');

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST create new job
router.post('/', async (req, res) => {
  try {
    const {
      slug,
      title,
      employer_id,
      location,
      job_type,
      category,
      salary_min,
      salary_max,
      excerpt,
      description,
      requirements,
      benefits,
      tags,
    } = req.body;

    if (!slug || !title || !employer_id) {
      return res.status(400).json({
        success: false,
        error: 'slug, title, and employer_id are required',
      });
    }

    const job = await Job.create({
      slug,
      title,
      employer_id,
      location,
      job_type,
      category,
      salary_min,
      salary_max,
      excerpt,
      description,
      requirements,
      benefits,
      status: 'active',
    });

    // Add tags if provided
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        await JobTag.create({
          job_id: job.id,
          tag_name: tag,
        });
      }
    }

    res.status(201).json({
      success: true,
      data: job,
      message: 'Job created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT update job
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    const {
      title,
      location,
      job_type,
      category,
      salary_min,
      salary_max,
      excerpt,
      description,
      requirements,
      benefits,
      status,
    } = req.body;

    await job.update({
      title: title || job.title,
      location: location || job.location,
      job_type: job_type || job.job_type,
      category: category || job.category,
      salary_min: salary_min !== undefined ? salary_min : job.salary_min,
      salary_max: salary_max !== undefined ? salary_max : job.salary_max,
      excerpt: excerpt || job.excerpt,
      description: description || job.description,
      requirements: requirements || job.requirements,
      benefits: benefits || job.benefits,
      status: status || job.status,
    });

    res.json({
      success: true,
      data: job,
      message: 'Job updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE job
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    await job.destroy();
    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
