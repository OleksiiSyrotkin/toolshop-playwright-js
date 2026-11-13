require('dotenv').config();

const urls = {
  saucedemo: process.env.SAUCEDEMO_URL || 'https://www.saucedemo.com',
  toolshop: process.env.TOOLSHOP_URL || 'https://practicesoftwaretesting.com',
  toolshopApi: process.env.TOOLSHOP_API_URL || 'https://api.practicesoftwaretesting.com',
};

const toolshopUser = {
  email: process.env.TOOLSHOP_EMAIL || 'customer@practicesoftwaretesting.com',
  password: process.env.TOOLSHOP_PASSWORD || 'welcome01',
  fullName: 'Jane Doe',
};

const authFile = '.auth/toolshop-customer.json';

module.exports = { urls, toolshopUser, authFile };
