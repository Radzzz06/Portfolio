document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const resetBtn = document.getElementById('reset-btn');
  // Run only on contact page
  if (!form || !submitBtn) return;
  // Validate when user clicks submit
  submitBtn.addEventListener('click', handleSubmit);
  // Reset form when "Send Another" is clicked
  if (resetBtn) resetBtn.addEventListener('click', resetForm);
  // Clear field error while typing
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach((input) => {
    input.addEventListener('input', () => clearFieldError(input));
  });
});

// Simple validation rules for each field
const validators = {
  'field-name': (value) => value.trim().length > 0,
  'field-email': (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value.trim());
  },
  'field-subject': (value) => value.trim().length > 0,
  'field-message': (value) => value.trim().length >= 20,
};

function handleSubmit() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  let allValid = true;
  for (const [fieldId, validate] of Object.entries(validators)) {
    const input = document.getElementById(fieldId);
    if (!input) continue;
    const isValid = validate(input.value);
    if (!isValid) {
      showFieldError(input);
      allValid = false;
    } else {
      clearFieldError(input);
    }
  }

  if (allValid) {
    showConfirmation();
  } else {
    // Move focus to first invalid field
    const firstError = form.querySelector('input.error, textarea.error');
    if (firstError) firstError.focus();
  }
}

function showFieldError(input) {
  input.classList.add('error');
  // Show linked error message span
  const errorId = input.getAttribute('aria-describedby');
  const errorEl = errorId ? document.getElementById(errorId) : null;
  if (errorEl) {
    errorEl.classList.add('visible');
  }
}

function clearFieldError(input) {
  input.classList.remove('error');
  const errorId = input.getAttribute('aria-describedby');
  const errorEl = errorId ? document.getElementById(errorId) : null;
  if (errorEl) {
    errorEl.classList.remove('visible');
  }
}

function showConfirmation() {
  const form = document.getElementById('contact-form');
  const confirmation = document.getElementById('form-confirmation');
  // Hide form and show success state
  if (form) form.style.display = 'none';
  if (confirmation) confirmation.classList.add('visible');
  // Focus success box for accessibility
  if (confirmation) confirmation.focus();
}

function resetForm() {
  const form = document.getElementById('contact-form');
  const confirmation = document.getElementById('form-confirmation');
  if (!form) return;
  // Clear all values and errors
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach((input) => {
    input.value = '';
    clearFieldError(input);
  });
  // Show form again
  if (confirmation) confirmation.classList.remove('visible');
  form.style.display = '';
  // Focus first field for quick re-entry
  const firstInput = form.querySelector('input');
  if (firstInput) firstInput.focus();
}