// Types/Interfaces para os dados que virão da API

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} icon - Nome do ícone ou URL
 * @property {string} color - Cor de fundo da categoria
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} brand
 * @property {number} price
 * @property {number} rating
 * @property {number} reviewCount
 * @property {string} image - URL da imagem
 * @property {boolean} inStock
 * @property {string} category
 */

/**
 * @typedef {Object} Stats
 * @property {number} pendingOrders
 * @property {number} pendingDeliveries
 * @property {number} cashback
 */

/**
 * @typedef {Object} Banner
 * @property {string} id
 * @property {string} title
 * @property {string} subtitle
 * @property {string} backgroundColor
 * @property {string} textColor
 */

/**
 * @typedef {Object} ShippingPromo
 * @property {number} minValue
 * @property {string} message
 */

export {};
