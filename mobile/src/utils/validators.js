// utils/validations.js
import is from 'is_js';

// ---- FIELD-WISE RULE CONFIGURATION ----
const RULES_CONFIG = {
  email: {
    required: true,
    rules: [is.email],
    messages: {
      required: 'Please enter your email',
      invalid: 'Please enter a valid email',
    },
  },
  emailForgot: {
    required: true,
    rules: [is.email],
    messages: {
      required: 'Please enter your email',
      invalid: 'Invalid email format, email not associated with an account',
    },
  },
  currentPassword: {
    required: true,
    rules: [is.not.empty,
    (val, data) => val !== data?.password,
    ],
    messages: {
      required: 'Please enter your current password',
      invalid: 'Current and new password cannot be the same',
    },
  },
  password: {
    required: true,
    rules: [
      (val) => val.length >= 8,
      (val) => /[A-Z]/.test(val),
      (val) => /[a-z]/.test(val),
      (val) => /[0-9]/.test(val),
      (val) => /[^A-Za-z0-9]/.test(val),
    ],
    messages: {
      required: 'Please enter your password',
      invalid:
        'Password must be at least 8 characters, with uppercase, lowercase, number, and symbol',
    },
  },
  newPassword: {
    required: true,
    rules: [
      (val) => val.length >= 8,
      (val) => /[A-Z]/.test(val),
      (val) => /[a-z]/.test(val),
      (val) => /[0-9]/.test(val),
      (val) => /[^A-Za-z0-9]/.test(val),
    ],
    messages: {
      required: 'Please enter your new password',
      invalid:
        'Password must be at least 8 characters, with uppercase, lowercase, number, and symbol',
    },
  },
  passwordLogin: {
    required: true,
    rules: [(val) => val.trim().length > 0],
    messages: {
      required: 'Please enter your password',
      invalid: 'Incorrect credentials',
    },
  },
  confirmPassword: {
    required: true,
    rules: [(val, data) => is.equal(val, data?.password)],
    messages: {
      required: 'Please confirm your password',
      invalid: 'Passwords do not match',
    },
  },
  agree: {
    required: true,
    rules: [(val) => val === true],
    messages: {
      required: 'Please agree to the terms',
      invalid: 'You must agree to the terms',
    },
  },
  avatar: {
    required: true,
    rules: [is.not.empty],
    messages: {
      required: 'Please upload your profile picture',
      invalid: 'Invalid image',
    },
  },
  firstname: {
    required: true,
    rules: [(val) => val.trim().length > 0],
    messages: {
      required: 'Please enter your first name',
      invalid: 'First name cannot be empty',
    },
  },
  lastname: {
    required: true,
    rules: [(val) => val.trim().length > 0],
    messages: {
      required: 'Please enter a last name',
      invalid: 'Last name cannot be empty',
    },
  },
  title: {
    required: true,
    rules: [(val) => val.trim().length > 0],
    messages: {
      required: 'Please enter a title',
      invalid: 'Title cannot be empty',
    },
  },
  name: {
    required: true,
    rules: [(val) => val.trim().length > 0],
    messages: {
      required: 'Please enter a name',
      invalid: 'Name cannot be empty',
    },
  },
  episodeTitle: {
    required: true,
    rules: [(val) => val.trim().length > 0],
    messages: {
      required: 'Please enter the episode title',
      invalid: 'Episode title cannot be empty',
    },
  },
  seriesTitle: {
    required: true,
    rules: [(val) => val.trim().length > 0],
    messages: {
      required: 'Please enter the series title',
      invalid: 'Series title cannot be empty',
    },
  },
  recommendedBy: {
    required: true,
    rules: [(val) => val.trim().length > 0],
    messages: {
      required: 'Please specify who recommended this',
      invalid: 'Recommended By cannot be empty',
    },
  },
};

// ---- VALIDATION ENGINE ----
const validateField = (value, config, formData) => {
  const { required, rules, messages } = config;

  // Empty check
  const isEmpty = value === undefined || value === null || value === '';

  if (required && isEmpty) {
    return messages.required;
  }

  if (!isEmpty) {
    for (const rule of rules) {
      const isValid = typeof rule === 'function' ? rule(value, formData) : rule(value);
      if (!isValid) return messages.invalid;
    }
  }

  return null;
};

// ---- SELECTIVE FORM VALIDATION ----
const validateForm = (formData, fieldsToValidate = []) => {
  const keys = fieldsToValidate.length > 0 ? fieldsToValidate : Object.keys(formData);

  for (const key of keys) {
    const config = RULES_CONFIG[key];
    if (!config) continue;

    const value = formData[key];
    const error = validateField(value, config, formData);

    if (error) {
      return { valid: false, message: error, field: key };
    }
  }

  return { valid: true };
};

// ---- MAIN VALIDATOR ----
const validator = {
  isValidData: (formData, fieldsToValidate = []) => validateForm(formData, fieldsToValidate),
};

export default validator;
