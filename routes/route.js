const express = require("express");
const routes = express();
const d = require('../controllers/controller')
const fileUpload = require('../middleWare/middleWare')
const transporter = require('../controllers/nodemailer')



routes.get('/',d.defaultRoute);
routes.post('/register',d.register);  
routes.get('/registerPage',d.registerPage)  
routes.get('/loginPage',d.loginPage)  
routes.post('/login', d.login)
routes.get('/blogPage',d.blogPage)
routes.post('/blog',fileUpload.single('file') ,  d.blog)
routes.get('/logOut',d.logOut)
routes.get('/cpassPage',d.cpassPage)
routes.post('/changePass',d.changePass)
routes.get('/deleteBlog/:id',d.deleteBlog)
routes.get('/editBlogPage/:id',d.editBlogPage)
routes.get('/forgetPage', d.forgetPage)
routes.post('/forgetPass',d.forgetPass)
routes.get('/verifyOTPpage',d.verifyOTPpage)
routes.post('/verifyOTP',d.verifyOTP)
// routes.get('/sendmail',transporter.sendmail)



module.exports = routes;
