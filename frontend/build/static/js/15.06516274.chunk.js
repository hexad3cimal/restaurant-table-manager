(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[15],{310:function(e,r,a){"use strict";var n=a(4),t=a(9),o=a(0),i=(a(6),a(10)),s=a(16),l=a(15),c=a(128),d=a(21),u=a(276),m=o.forwardRef((function(e,r){var a=e.classes,l=e.className,m=e.color,b=void 0===m?"primary":m,p=e.component,h=void 0===p?"a":p,w=e.onBlur,j=e.onFocus,g=e.TypographyClasses,f=e.underline,x=void 0===f?"hover":f,v=e.variant,O=void 0===v?"inherit":v,y=Object(t.a)(e,["classes","className","color","component","onBlur","onFocus","TypographyClasses","underline","variant"]),C=Object(c.a)(),B=C.isFocusVisible,q=C.onBlurVisible,P=C.ref,E=o.useState(!1),k=E[0],N=E[1],R=Object(d.a)(r,P);return o.createElement(u.a,Object(n.a)({className:Object(i.a)(a.root,a["underline".concat(Object(s.a)(x))],l,k&&a.focusVisible,"button"===h&&a.button),classes:g,color:b,component:h,onBlur:function(e){k&&(q(),N(!1)),w&&w(e)},onFocus:function(e){B(e)&&N(!0),j&&j(e)},ref:R,variant:O},y))}));r.a=Object(l.a)({root:{},underlineNone:{textDecoration:"none"},underlineHover:{textDecoration:"none","&:hover":{textDecoration:"underline"}},underlineAlways:{textDecoration:"underline"},button:{position:"relative",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle","-moz-appearance":"none","-webkit-appearance":"none","&::-moz-focus-inner":{borderStyle:"none"},"&$focusVisible":{outline:"auto"}},focusVisible:{}},{name:"MuiLink"})(m)},408:function(e,r,a){"use strict";var n=a(17),t=a(38),o=a(8),i=a(0),s=a(415),l=a(6),c=a.n(l),d=Object(i.forwardRef)((function(e,r){var a=e.children,i=e.title,l=void 0===i?"":i,c=Object(t.a)(e,["children","title"]);return Object(o.jsxs)("div",Object(n.a)(Object(n.a)({ref:r},c),{},{children:[Object(o.jsx)(s.a,{children:Object(o.jsx)("title",{children:l})}),a]}))}));d.propTypes={children:c.a.node.isRequired,title:c.a.string},r.a=d},503:function(e,r,a){"use strict";a.r(r);var n=a(7),t=a.n(n),o=a(69),i=a(8),s=a(0),l=a(13),c=a(25),d=a(423),u=a(399),m=a(289),b=a(306),p=a(276),h=a(318),w=a(275),j=a(310),g=a(408),f=a(37),x=a(64),v=a(108),O=a(20),y=Object(u.a)((function(e){return{root:{height:"100%",paddingBottom:e.spacing(3),paddingTop:e.spacing(3)}}}));r.default=function(){var e=y(),r=Object(l.g)(),a=Object(f.b)(),n=Object(f.c)((function(e){return e.app})),u=Object(f.c)((function(e){return e.user})),C=Object(s.useRef)({}),B=Object(s.useRef)({}),q=new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,})"),P=new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");n.alert.show&&(Object(v.a)({message:n.alert.message}),a(Object(x.t)()),u.registered&&r("/login"));var E={newEmail:{required:!0,remoteValidate:!0,url:"".concat(window.restAppConfig.api,"user/validate?email"),regex:P,errorMessages:{required:"Email is Required",remoteValidate:"Email already Taken",regex:"Enter a valid email"}},newUserName:{required:!0,remoteValidate:!0,url:"".concat(window.restAppConfig.api,"user/validate?username"),errorMessages:{required:"Username is Required",remoteValidate:"Username already Taken"}},newPassword:{required:!0,regex:q,errorMessages:{required:"Password is Required",regex:"Password should contain at least 1 numeric,special character and be of atleast 5 characters"}},passwordConfirm:{required:!0,compareWith:"newPassword",errorMessages:{required:"Please confirm the password",compareWith:"Password doesn't match"}},name:{required:!0,errorMessages:{required:"Org name is Required"}}},k=function(){var e=Object(o.a)(t.a.mark((function e(r){var a,n;return t.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a={},e.t0=t.a.keys(r);case 2:if((e.t1=e.t0()).done){e.next=15;break}if(n=e.t1.value,E[n].required&&!r[n]&&(a[n]=E[n].errorMessages.required),!E[n].remoteValidate){e.next=11;break}if(B.current[n]===r[n]&&!C.current[n]){e.next=11;break}return e.next=9,Object(O.d)("".concat(E[n].url,"=").concat(r[n]));case 9:e.sent||(a[n]=E[n].errorMessages.remoteValidate);case 11:E[n].regex&&(E[n].regex.test(r[n])||(a[n]=E[n].errorMessages.regex)),E[n].compareWith&&r[n]!==r[E[n].compareWith]&&(a[n]=E[n].errorMessages.compareWith),e.next=2;break;case 15:return C.current=a,B.current=r,e.abrupt("return",a);case 18:case"end":return e.stop()}}),e)})));return function(r){return e.apply(this,arguments)}}();return Object(i.jsx)(g.a,{className:e.root,title:"Register",children:Object(i.jsx)(m.a,{display:"flex",height:"100%",justifyContent:"center",children:Object(i.jsx)(b.a,{maxWidth:"sm",children:Object(i.jsx)(d.a,{initialValues:{newEmail:"",name:"",newUserName:"",newPassword:"",passwordConfirm:""},validate:k,onSubmit:function(e){e.org=!0,a(Object(x.B)(e))},children:function(e){var r=e.errors,a=e.handleBlur,n=e.handleChange,t=e.handleSubmit,o=(e.isSubmitting,e.touched),s=e.values;return Object(i.jsxs)("form",{onSubmit:t,children:[Object(i.jsxs)(m.a,{mb:3,children:[Object(i.jsx)(p.a,{color:"textPrimary",variant:"h2",children:"Create new account"}),Object(i.jsx)(p.a,{color:"textSecondary",gutterBottom:!0,variant:"body2",children:"Fill in details to create new account"})]}),Object(i.jsx)(h.a,{error:Boolean(o.name&&r.name),fullWidth:!0,helperText:o.name&&r.name,label:"Org name",margin:"normal",name:"name",onBlur:a,onChange:n,value:s.name,variant:"outlined"}),Object(i.jsx)(h.a,{error:Boolean(o.newEmail&&r.newEmail),fullWidth:!0,helperText:o.newEmail&&r.newEmail,label:"Email Address",margin:"normal",name:"newEmail",onBlur:a,onChange:n,type:"email",value:s.newEmail,variant:"outlined"}),Object(i.jsx)(h.a,{error:Boolean(o.newUserName&&r.newUserName),fullWidth:!0,helperText:o.newUserName&&r.newUserName,label:"Username",margin:"normal",name:"newUserName",onBlur:a,onChange:n,value:s.newUserName,variant:"outlined"}),Object(i.jsx)(h.a,{error:Boolean(o.newPassword&&r.newPassword),fullWidth:!0,helperText:o.newPassword&&r.newPassword,label:"Password",margin:"normal",name:"newPassword",onBlur:a,onChange:n,type:"password",value:s.newPassword,variant:"outlined"}),Object(i.jsx)(h.a,{error:Boolean(o.passwordConfirm&&r.passwordConfirm),fullWidth:!0,helperText:o.passwordConfirm&&r.passwordConfirm,label:"Confirm Password",margin:"normal",name:"passwordConfirm",onBlur:a,onChange:n,type:"password",value:s.passwordConfirm,variant:"outlined"}),Object(i.jsx)(m.a,{my:2,children:Object(i.jsx)(w.a,{color:"primary",fullWidth:!0,size:"large",type:"submit",variant:"contained",children:"Sign up now"})}),Object(i.jsxs)(p.a,{color:"textSecondary",variant:"body1",children:["Have an account?",Object(i.jsx)(j.a,{component:c.b,to:"/login",variant:"h6",children:"Sign in"})]})]})}})})})})}}}]);
//# sourceMappingURL=15.06516274.chunk.js.map