(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[20],{408:function(e,a,t){"use strict";var r=t(17),n=t(38),i=t(8),s=t(1),o=t(413),c=t(6),l=t.n(c),d=Object(s.forwardRef)((function(e,a){var t=e.children,s=e.title,c=void 0===s?"":s,l=Object(n.a)(e,["children","title"]);return Object(i.jsxs)("div",Object(r.a)(Object(r.a)({ref:a},l),{},{children:[Object(i.jsx)(o.a,{children:Object(i.jsx)("title",{children:c})}),t]}))}));d.propTypes={children:l.a.node.isRequired,title:l.a.string},a.a=d},502:function(e,a,t){"use strict";t.r(a);var r=t(8),n=t(1),i=t(13),s=t(25),o=t(496),c=t(423),l=t(399),d=t(289),u=t(302),b=t(295),h=t(276),j=t(304),m=t(275),p=t(309),g=t(408),x=t(37),O=t(64),f=t(108),v=t(20),w=Object(l.a)((function(e){return{root:{height:"100%",paddingBottom:e.spacing(3),paddingTop:e.spacing(3)},box:{display:"flex"},homeBox:{height:"100%",backgroundImage:"url('/images/bg.png')",backgroundRepeat:"no-repeat",backgroundSize:"contain",margin:e.spacing(6)},loginBox:{height:"100%",marginTop:e.spacing(10)}}}));a.default=function(){var e=w(),a=Object(i.g)(),t=Object(x.b)(),l=Object(x.c)((function(e){return e.app})),N=Object(x.c)((function(e){return e.user}));return l.alert.show&&(Object(f.a)({message:l.alert.message}),t(Object(O.u)())),Object(n.useEffect)((function(){if(N.isAuthenticated){if("table"===N.user.role)return void a("/table",{replace:!0});if("kitchen"===N.user.role)return void a("/app/kitchen",{replace:!0});a("/app/dashboard",{replace:!0})}}),[N.isAuthenticated]),Object(r.jsx)(g.a,{className:e.root,title:"Login",children:Object(r.jsx)(d.a,{className:e.box,children:Object(r.jsxs)(u.a,{className:e.box,children:[Object(r.jsx)(b.a,{item:!0,md:12,xs:!1,className:e.homeBox}),Object(r.jsx)(b.a,{className:e.loginBox,item:!0,md:12,xs:12,children:Object(r.jsx)(c.a,{initialValues:{userName:"",password:""},validationSchema:o.a().shape({userName:o.b().max(255).required("UserName is required"),password:o.b().max(255).required("Password is required")}),onSubmit:function(e,a){t(Object(O.B)(e)),a.setSubmitting(!1)},children:function(e){var a=e.errors,t=e.handleBlur,n=e.handleChange,i=e.handleSubmit,o=e.isSubmitting,c=e.touched,l=e.values;return Object(r.jsxs)("form",{onSubmit:i,children:[Object(r.jsxs)(d.a,{mb:3,children:[Object(r.jsx)(h.a,{color:"textPrimary",variant:"h2",children:"Sign in"}),Object(r.jsx)(h.a,{color:"textSecondary",gutterBottom:!0,variant:"body2",children:"Sign in on the internal platform"})]}),Object(r.jsx)(j.a,{error:Boolean(c.userName&&a.userName),fullWidth:!0,helperText:c.userName&&a.userName,label:"Username",margin:"normal",name:"userName",type:"text",onBlur:t,onChange:n,value:l.userName,variant:"outlined"}),Object(r.jsx)(j.a,{error:Boolean(c.password&&a.password),fullWidth:!0,helperText:c.password&&a.password,label:"Password",margin:"normal",name:"password",onBlur:t,onChange:n,type:"password",value:l.password,variant:"outlined"}),Object(r.jsx)(d.a,{my:2,children:Object(r.jsx)(m.a,{color:"primary",disabled:o||!Object(v.b)(a,c),fullWidth:!0,size:"large",type:"submit",variant:"contained","data-testid":"label",children:"Sign in now"})}),Object(r.jsxs)(h.a,{color:"textSecondary",variant:"body1",children:["Don't have an account?"," ",Object(r.jsx)(p.a,{component:s.b,to:"/register",variant:"h6",children:"Sign up"})]})]})}})})]})})})}}}]);
//# sourceMappingURL=20.154b892b.chunk.js.map