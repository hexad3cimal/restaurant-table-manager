(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[18],{408:function(e,t,c){"use strict";var a=c(17),n=c(38),r=c(8),i=c(0),s=c(415),j=c(6),l=c.n(j),d=Object(i.forwardRef)((function(e,t){var c=e.children,i=e.title,j=void 0===i?"":i,l=Object(n.a)(e,["children","title"]);return Object(r.jsxs)("div",Object(a.a)(Object(a.a)({ref:t},l),{},{children:[Object(r.jsx)(s.a,{children:Object(r.jsx)("title",{children:j})}),c]}))}));d.propTypes={children:l.a.node.isRequired,title:l.a.string},t.a=d},509:function(e,t,c){"use strict";c.r(t);var a=c(8),n=c(0),r=c.n(n),i=c(399),s=c(306),j=c(296),l=c(408),d=c(65),o=c(489),b=c.n(o),h=c(432),x=c.n(h),O=c(301),m=c(311),u=c(277),f=c(289),p=c(297),g=c(302),v=c(298),y=c(299),N=c(329),S=c(339),w=c(300),I=c(285),C=c(303),B=c(276),k=c(316),D=c(275),V=c(493),z=c.n(V),R=c(454),P=c.n(R),A=c(453),T=c.n(A),Y=c(37),E=c(139),$=Object(i.a)((function(){return{root:{display:"flex",flexDirection:"column"},noOrder:{alignSelf:"center",margin:"5rem"}}})),q=function(){var e=Object(Y.b)(),t=$(),c=Object(Y.c)((function(e){return e.order}))||{},i=c&&c.orders||[],s=r.a.useState({id:null}),j=Object(d.a)(s,2),l=j[0],o=j[1],h=r.a.useState({id:null}),V=Object(d.a)(h,2),R=V[0],A=V[1];return Object(n.useEffect)((function(){e(Object(E.d)())}),[]),Object(a.jsxs)(O.a,{className:t.root,children:[Object(a.jsx)(m.a,{title:"Latest Orders"}),Object(a.jsx)(u.a,{}),i.length>0?Object(a.jsx)(x.a,{children:Object(a.jsxs)(f.a,{minWidth:800,children:[Object(a.jsxs)(p.a,{children:[Object(a.jsx)(g.a,{children:Object(a.jsxs)(v.a,{children:[Object(a.jsx)(y.a,{children:"Order Ref"}),Object(a.jsx)(y.a,{children:"Branch"}),Object(a.jsx)(y.a,{children:"Product"}),Object(a.jsx)(y.a,{children:"Cost"}),Object(a.jsx)(y.a,{sortDirection:"desc",children:Object(a.jsx)(N.a,{enterDelay:300,title:"Sort",children:Object(a.jsx)(S.a,{active:!0,direction:"desc",children:"Date"})})}),Object(a.jsx)(y.a,{children:"Status"})]})}),Object(a.jsx)(w.a,{children:i.map((function(e){return Object(a.jsxs)(v.a,{hover:!0,children:[Object(a.jsx)(y.a,{children:e.refCode}),Object(a.jsx)(y.a,{children:e.branchName}),Object(a.jsxs)(y.a,{children:[Object(a.jsx)(I.a,{"aria-label":"expand row",size:"small",onClick:function(){var t;l===(t=e).id?o(null):o(t.id)},children:l===e.id?Object(a.jsx)(T.a,{}):Object(a.jsx)(P.a,{})})," ","Order Items",Object(a.jsx)(C.a,{in:l===e.id,timeout:"auto",unmountOnExit:!0,children:Object(a.jsxs)(f.a,{margin:1,children:[Object(a.jsx)(B.a,{variant:"h6",gutterBottom:!0,component:"div",children:"Items in Order"}),Object(a.jsxs)(p.a,{size:"small","aria-label":"purchases",children:[Object(a.jsx)(g.a,{children:Object(a.jsxs)(v.a,{children:[Object(a.jsx)(y.a,{children:"Name"}),Object(a.jsx)(y.a,{children:"Quantity"}),Object(a.jsx)(y.a,{children:"Amount"}),Object(a.jsx)(y.a,{children:"Customisations"})]})}),Object(a.jsx)(w.a,{children:e.orderItems.map((function(e){return Object(a.jsxs)(v.a,{children:[Object(a.jsx)(y.a,{component:"th",scope:"row",children:e.productName}),Object(a.jsx)(y.a,{children:e.quantity}),Object(a.jsx)(y.a,{children:e.price}),Object(a.jsxs)(y.a,{children:[Object(a.jsx)(I.a,{"aria-label":"expand row",size:"small",onClick:function(){return function(e){R===e.id?A(null):A(e.id)}(e)},children:R===e.id?Object(a.jsx)(T.a,{}):Object(a.jsx)(P.a,{})})," ","Addons",Object(a.jsx)(C.a,{in:R===e.id,timeout:"auto",unmountOnExit:!0,children:Object(a.jsxs)(f.a,{margin:1,children:[Object(a.jsx)(B.a,{variant:"h6",gutterBottom:!0,component:"div",children:"Customisations"}),Object(a.jsxs)(p.a,{size:"small","aria-label":"purchases",children:[Object(a.jsx)(g.a,{children:Object(a.jsxs)(v.a,{children:[Object(a.jsx)(y.a,{children:"Name"}),Object(a.jsx)(y.a,{align:"right",children:"Amount"})]})}),Object(a.jsx)(w.a,{children:e.customisations.length?e.customisations.map((function(e){return Object(a.jsxs)(v.a,{children:[Object(a.jsx)(y.a,{component:"th",scope:"row",children:e.name}),Object(a.jsx)(y.a,{align:"right",children:e.price})]},e.id)})):Object(a.jsx)(B.a,{variant:"h6",gutterBottom:!0,component:"div",children:"No Customisations added"})})]})]})})]})]},e.id)}))})]})]})})]}),Object(a.jsx)(y.a,{children:e.price}),Object(a.jsx)(y.a,{children:b()(e.CreatedAt).format("DD/MM/YYYY")}),Object(a.jsx)(y.a,{children:Object(a.jsx)(k.a,{color:"primary",label:e.status,size:"small"})})]},e.id)}))})]}),Object(a.jsx)(f.a,{display:"flex",justifyContent:"flex-end",p:2,children:Object(a.jsx)(D.a,{color:"primary",endIcon:Object(a.jsx)(z.a,{}),size:"small",variant:"text",children:"View all"})})]})}):Object(a.jsx)(B.a,{variant:"h3",className:t.noOrder,children:"No orders yet"})]})},J=c(27),M=c(304),W=c(317),H=c(456),L=c.n(H),Q=c(455),F=c.n(Q),G=Object(i.a)((function(e){return{root:{height:"100%"},avatar:{backgroundColor:J.a.red[600],height:56,width:56},differenceIcon:{color:J.a.red[900]},differenceValue:{color:J.a.red[900],marginRight:e.spacing(1)}}})),K=function(){var e=G();return Object(a.jsx)(O.a,{children:Object(a.jsxs)(M.a,{children:[Object(a.jsxs)(j.a,{container:!0,justify:"space-between",spacing:3,children:[Object(a.jsxs)(j.a,{item:!0,children:[Object(a.jsx)(B.a,{color:"textSecondary",gutterBottom:!0,variant:"h6",children:"Total Orders            "}),Object(a.jsx)(B.a,{color:"textPrimary",variant:"h3",children:"$24,000"})]}),Object(a.jsx)(j.a,{item:!0,children:Object(a.jsx)(W.a,{className:e.avatar,children:Object(a.jsx)(F.a,{})})})]}),Object(a.jsxs)(f.a,{mt:2,display:"flex",alignItems:"center",children:[Object(a.jsx)(L.a,{className:e.differenceIcon}),Object(a.jsx)(B.a,{className:e.differenceValue,variant:"body2",children:"12%"}),Object(a.jsx)(B.a,{color:"textSecondary",variant:"caption",children:"Since last month"})]})]})})},U=Object(i.a)((function(e){return{root:{height:"100%"},avatar:{backgroundColor:J.a.red[600],height:56,width:56},differenceIcon:{color:J.a.red[900]},differenceValue:{color:J.a.red[900],marginRight:e.spacing(1)}}})),X=function(){var e=U();return Object(a.jsx)(O.a,{children:Object(a.jsxs)(M.a,{children:[Object(a.jsxs)(j.a,{container:!0,justify:"space-between",spacing:3,children:[Object(a.jsxs)(j.a,{item:!0,children:[Object(a.jsx)(B.a,{color:"textSecondary",gutterBottom:!0,variant:"h6",children:"Total Sales"}),Object(a.jsx)(B.a,{color:"textPrimary",variant:"h3",children:"$24,000"})]}),Object(a.jsx)(j.a,{item:!0,children:Object(a.jsx)(W.a,{className:e.avatar,children:Object(a.jsx)(F.a,{})})})]}),Object(a.jsxs)(f.a,{mt:2,display:"flex",alignItems:"center",children:[Object(a.jsx)(L.a,{className:e.differenceIcon}),Object(a.jsx)(B.a,{className:e.differenceValue,variant:"body2",children:"12%"}),Object(a.jsx)(B.a,{color:"textSecondary",variant:"caption",children:"Since last month"})]})]})})},Z=Object(i.a)((function(e){return{root:{height:"100%"},avatar:{backgroundColor:J.a.red[600],height:56,width:56},differenceIcon:{color:J.a.red[900]},differenceValue:{color:J.a.red[900],marginRight:e.spacing(1)}}})),_=function(){var e=Z();return Object(a.jsx)(O.a,{children:Object(a.jsxs)(M.a,{children:[Object(a.jsxs)(j.a,{container:!0,justify:"space-between",spacing:3,children:[Object(a.jsxs)(j.a,{item:!0,children:[Object(a.jsx)(B.a,{color:"textSecondary",gutterBottom:!0,variant:"h6",children:"Products"}),Object(a.jsx)(B.a,{color:"textPrimary",variant:"h3",children:"$24,000"})]}),Object(a.jsx)(j.a,{item:!0,children:Object(a.jsx)(W.a,{className:e.avatar,children:Object(a.jsx)(F.a,{})})})]}),Object(a.jsxs)(f.a,{mt:2,display:"flex",alignItems:"center",children:[Object(a.jsx)(L.a,{className:e.differenceIcon}),Object(a.jsx)(B.a,{className:e.differenceValue,variant:"body2",children:"12%"}),Object(a.jsx)(B.a,{color:"textSecondary",variant:"caption",children:"Since last month"})]})]})})},ee=c(64),te=Object(i.a)((function(e){return{root:{minHeight:"100%",paddingBottom:e.spacing(3),paddingTop:e.spacing(3)}}}));t.default=function(){var e=te();return Object(Y.b)()(Object(ee.m)()),Object(a.jsx)(l.a,{className:e.root,title:"Dashboard",children:Object(a.jsx)(s.a,{maxWidth:!1,children:Object(a.jsxs)(j.a,{container:!0,spacing:3,children:[Object(a.jsx)(j.a,{item:!0,lg:4,sm:4,xl:4,xs:12,children:Object(a.jsx)(K,{})}),Object(a.jsx)(j.a,{item:!0,lg:4,sm:4,xl:4,xs:12,children:Object(a.jsx)(_,{})}),Object(a.jsx)(j.a,{item:!0,lg:4,sm:4,xl:4,xs:12,children:Object(a.jsx)(X,{})}),Object(a.jsx)(j.a,{item:!0,md:12,children:Object(a.jsx)(q,{})})]})})})}}}]);
//# sourceMappingURL=18.5cabd02d.chunk.js.map