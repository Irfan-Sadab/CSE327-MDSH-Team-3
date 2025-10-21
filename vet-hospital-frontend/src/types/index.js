/**
 * @typedef {Object} HeroContent
 * @property {string} title
 * @property {string} subtitle
 * @property {{ label: string }} primaryCta
 * @property {{ label: string }} secondaryCta
 *
 * @typedef {Object} Service
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} [icon]
 *
 * @typedef {Object} Statistic
 * @property {string} id
 * @property {string} label
 * @property {string|number} value
 *
 * @typedef {Object} Testimonial
 * @property {string} id
 * @property {string} quote
 * @property {string} author
 * @property {string} role
 * @property {number} [rating]
 *
 * @typedef {Object} Doctor
 * @property {string} id
 * @property {string} name
 * @property {string} specialty
 * @property {number} [rating]
 * @property {string} [avatarUrl]
 * @property {number} [reviewCount]
 *
 * @typedef {Object} HomePayload
 * @property {HeroContent} hero
 * @property {Service[]} services
 * @property {Statistic[]} statistics
 * @property {Testimonial[]} testimonials
 * @property {AppointmentSlot[]} [appointmentSlots]
 *
 * @typedef {Object} AboutPayload
 * @property {string} phone
 * @property {string} email
 * @property {string} address
 * @property {string} [description]
 *
 * @typedef {Object} AppointmentSlot
 * @property {string} id
 * @property {string} doctorId
 * @property {string} startTime ISO 8601 timestamp
 * @property {string} endTime ISO 8601 timestamp
 * @property {boolean} available
 *
 * @typedef {Object} AppointmentRequest
 * @property {string} doctorId
 * @property {string} slotId
 * @property {string} patientName
 * @property {string} patientEmail
 * @property {string} [notes]
 *
 * @typedef {Object} AppointmentResponse
 * @property {string} appointmentId
 * @property {string} status
 * @property {string} [message]
 *
 * @typedef {Object} ChatbotRequest
 * @property {string} message
 * @property {string} [conversationId]
 *
 * @typedef {Object} ChatbotResponse
 * @property {string} message
 * @property {string} [conversationId]
 *
 * @typedef {Object} AppointmentSummary
 * @property {string} id
 * @property {string} doctorId
 * @property {string} doctorName
 * @property {string} slotStart ISO 8601 timestamp
 * @property {string} slotEnd ISO 8601 timestamp
 * @property {string} status
 */

export {};
