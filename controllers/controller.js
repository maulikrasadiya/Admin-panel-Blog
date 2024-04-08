const userModel = require("../models/model");
const blogModel = require("../models/blogModel");
const cookies = require("cookies");
const bcrypt = require("bcrypt");
const fs = require("fs");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "maulikpatel4334@gmail.com",
    pass: "inerlebajixhyjav",
  },
});

const userLogin = async (req, res) => {
  try {
    if (req.body.email == userModel.email) {
      console.log("Login Email Id Succes...");
      if (req.body.pass == userModel.pass) {
        console.log("Login Password Succes...");
      } else {
        console.log("Login Pass Errer");
      }
    } else {
      console.log("Login Email Errer...");
      res.redirect("register");
    }
  } catch (err) {
    console.log("Login Errer...");
  }

  // res.render('login');
};

const defaultRoute = async (req, res) => {
  const login = req.cookies;
  console.log("Login", login);

  if (login.uid) {
    res.render("index");
  } else {
    res.render("login");
  }
};

const loginPage = async (req, res) => {
  res.render("login");
};

const registerPage = async (req, res) => {
  res.render("register");
};

const homePage = async (req, res) => {
  res.render("index");
};

const blogPage = async (req, res) => {
  const blogs = await blogModel.find();

  // console.log("Blogs log := ",blogs);

  const filterData = await blogs.filter((b) => {
    // console.log(b);

    return req.cookies.uid == b.userId;
  });
  console.log("filterData := ", filterData);

  res.render("blog", { filterData });
};

const cpassPage = async (req, res) => {
  res.render("cpassPage");
};

const editBlogPage = (req, res) => {
  res.render("editBlog");
};

const forgetPage = (req, res) => {
  res.render("forgetPage");
};

const verifyOTPpage = (req, res) => {
  res.render("verifyOTPpage");
};

const forgetPass = async (req, res) => {
  const data = await userModel.find();

  const email = data.filter((e) => {
    return req.body.email == e.email;
  });

  if (email) {
    // const randomOTP = Math.round(Math.random() * 10000)
    const randomOTP = randomstring.generate({
      length: 4,
      charset: "numeric",
    });

    console.log(randomOTP);

    var otpCookie = {
      httpOnly: true,
    };

    let { OTP } = req.cookies;

    const mail = async () => {
      const info = await transporter.sendMail({
        from: "maulikpatel4334@gmail.com", // sender address
        to: req.body.email, // list of receivers
        subject: "OTP", // Subject line
        html: `Your OTP is <b>${randomOTP} </b>`,
      });
      console.log("Message sent: %s", info.messageId);
    };
    mail();
    res.cookie("OTP", randomOTP, otpCookie);
    res.redirect("/verifyOTPpage");
  } else {
    res.redirect("/forgetPass");
  }
};

const verifyOTP = async (req, res) => {
  let { OTP } = req.cookies;
  let { digit1, digit2, digit3, digit4 } = req.body;
  let userOtp = digit1 + digit2 + digit3 + digit4;

  console.log("UserOTP :=", userOtp);

  try {
    if (userOtp == OTP) {
      console.log("yess");
      res.redirect("/cpassPage");
    } else {
      res.redirect("/forgetPage");
    }
  } catch (err) {
    console.log(err);
  }
};

const register = async (req, res) => {
  // console.log(req.body);

  try {
    let saltratio = 10;
    const encpass = await bcrypt.hash(req.body.pass, saltratio);
    var email = req.body.email;

    const user = new userModel({
      name: req.body.name,
      email: req.body.email,
      pass: encpass,
    });
    if (req.body.pass === req.body.cpass) {
      await user.save();

      const sendmail = async (req, res) => {
        console.log("ok");

        const mail = async () => {
          const info = await transporter.sendMail({
            from: "maulikpatel4334@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Hello", // Subject line
            html:
              "<b>You're welcome! If youre looking for a message to greet or thank users who have registered on your site, something simple like Thank you for joining us! or Welcome aboard! can be a warm and friendly way to acknowledge their registration. </b>",
          });
          console.log("Message sent: %s", info.messageId);
        };

        mail();
      };
      sendmail();
      res.redirect("/loginPage");
    } else {
      res.redirect("/registerPage");
      console.log("Your password is not match");
    }
  } catch (err) {
    console.log(err, "Register Errer...");
  }
};

const login = async (req, res) => {
  try {
    const datas = await userModel.find();

    const user = datas.filter((d) => {
      return req.body.email == d.email;
    });
    console.log("user", user);

    if (user) {
      console.log("Login Email Id Succes...");

      let checkPass = await bcrypt.compare(req.body.pass, user[0].pass);
      console.log("checkPass", checkPass);
      if (checkPass) {
        console.log("Login Password Succes...");

        const userId = user[0].id;
        var usrCookie = {
          httpOnly: true,
        };

        res.cookie("uid", userId, usrCookie);
        res.redirect("/");
      } else {
        console.log("Login Pass Errer");
        res.redirect("/registerPage");
      }
    } else {
      console.log("Login Email Errer...");
      res.render("register");
    }
  } catch (err) {
    console.log("Login Errer...", err);
  }

  // try{
  //     // console.log("req", req.body.email);
  //     if(req.body.email == userModel.email){
  //         console.log("userModel.email",userModel.email);
  //         // console.log("Succes..............");
  //         if(req.body.pass == userModel.pass){
  //             console.log("Pass");
  //             res.redirect('index');
  //         }else{
  //             console.log("Password Is Not Match...");
  //             res.redirect('index');
  //         }
  //     }else{
  //         console.log("Email is Not Match...");
  //         res.redirect('index')  ;
  //     }
  // }
  // catch(err){
  //     console.log("Login Errer...",err);
  // }
};

const logOut = async (req, res) => {
  res.clearCookie("uid");
  res.redirect("/");
};

const blog = async (req, res) => {
  console.log(req.body, req.file);

  const user = blogModel({
    title: req.body.title,
    description: req.body.description,
    file: req.file.path,
    userId: req.cookies.uid,
  });

  user.save();
  res.redirect("/blogPage");
};

const changePass = async (req, res) => {
  try {
    console.log(req.body);
    const { uid } = req.cookies;
    const oldPass = await userModel.findById(uid);
    console.log("Change Password", oldPass);

    // let comPass = await bcrypt.compare(req.body.oldPass, oldPass.pass)

    let comPass = bcrypt.compare(req.body.oldPass, oldPass.pass);
    // var comPass = (req,res) => {
    //     return req.body.oldPass, oldPass.pass
    // }

    console.log("comPass", comPass);

    if (comPass) {
      let saltratio = 10;
      const updatePass = await bcrypt.hash(req.body.newPass, saltratio);
      console.log("Upadte Encript Password :-", updatePass);

      const updated = await userModel.findByIdAndUpdate(uid, {
        pass: updatePass,
      });
      // userModel.findByIdAndUpdate({pass : updatePass})

      res.render("index");
    } else {
      res.redirect("/cpassPage");
    }
  } catch (err) {
    console.log(err, "Pass Errer");
    // res.redirect('/homePage')
  }
};

const deleteBlog = async (req, res) => {
  try {
    const deleteBlogs = await blogModel.findByIdAndDelete(req.params.id);
    console.log("log := deleteBlogs", deleteBlogs);

    fs.unlink(deleteBlogs.file, () => {
      console.log("Success Delete Blog Image...");
    });
    res.redirect("/blogPage");
  } catch (err) {
    console.log("Delete Blog Errer", err);
  }
};

const editBlog = (req, res) => {
  console.log(req.body);
};

module.exports = {
  defaultRoute,
  register,
  login,
  blog,
  userLogin,
  registerPage,
  loginPage,
  homePage,
  blogPage,
  editBlogPage,
  forgetPage,
  verifyOTPpage,
  forgetPass,
  verifyOTP,
  logOut,
  blog,
  cpassPage,
  changePass,
  deleteBlog,
  editBlog,
};
