const { z } = require('zod');

/**
 * Express middleware factory that validates request body against a Zod schema.
 * Uses safeParse for reliable error handling.
 * Usage:
 *   router.post('/register', validate(registerSchema), controller);
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const issues = result.error.issues || result.error.errors || [];
    const messages = issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      message: 'Validation failed',
      errors: messages,
    });
  }
  req.body = result.data;
  next();
};

// ─── Auth Schemas ──────────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
  phone: z.string().optional().default(''),
  role: z.enum(['student', 'tutor']).optional().default('student'),
});

const loginSchema = z.object({
  phone: z.string().min(4, 'Phone is required').max(20),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
});

const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  phone: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').max(128),
});

// ─── Booking Schemas ───────────────────────────────────────────────

const createBookingSchema = z.object({
  tutor: z.string().min(1, 'Tutor ID is required'),
  subject: z.string().min(1, 'Subject is required'),
  date: z.string().min(1, 'Date is required'),
  duration: z.number().int().positive('Duration must be positive'),
  location: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  mode: z.enum(['online', 'inPerson', 'institute']).optional().default('online'),
  instituteId: z.string().optional().nullable().default(null),
  isTrial: z.boolean().optional().default(false),
});

// ─── Tutor Schemas ─────────────────────────────────────────────────

const createTutorProfileSchema = z.object({
  bio: z.string().optional().default(''),
  subjects: z.array(z.string()).optional().default([]),
  ratePerHour: z.number().positive('Rate must be positive'),
  experience: z.number().int().min(0).optional().default(0),
  emirate: z.string().optional().default(''),
  area: z.string().optional().default(''),
  teachingMode: z.enum(['online', 'inPerson', 'both']).optional().default('both'),
  qualifications: z.array(z.string()).optional().default([]),
  education: z.string().optional().default(''),
  languages: z.array(z.string()).optional().default([]),
  isAvailable: z.boolean().optional().default(true),
  trialAvailable: z.boolean().optional().default(false),
  trialPrice: z.number().min(0).optional().default(0),
});

// ─── Settings Schema ───────────────────────────────────────────────

const updateSettingsSchema = z.object({
  platformFeePercent: z.number().min(0, 'Fee must be 0 or more').max(100, 'Fee cannot exceed 100%'),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  createBookingSchema,
  createTutorProfileSchema,
  updateSettingsSchema,
};
