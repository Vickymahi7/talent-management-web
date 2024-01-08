import{d as U,u as F,p as A,r as c,c as B,C as d,a as h,N as R,O as T,b as j,q as z,l as g,H as k,E as D,o as t,j as r,w as v,F as f,h as s,n as y,i as u,v as P,k as x,t as $,s as E,z as w,x as H,g as I,y as O,m as G}from"./index-c0797ffd.js";const J={class:"login-container"},K=s("img",{src:O,alt:""},null,-1),Q={class:"login-section h-100 w-100"},W={key:0,class:""},X=s("h6",{class:"text-center"},"Please wait...",-1),Y=[X],Z=s("h4",{class:"text-center"},"Reset Password",-1),ss={class:"p-3"},es={class:"row"},as={class:"col-12"},os={class:"form-group"},ts=s("label",{for:"password"},"Password",-1),rs={class:"col-12"},ns={class:"form-group"},is=s("label",{for:"confirmPassword"},"Confirm Password",-1),ls={class:"text-center mt-3"},cs=["onClick"],ds={key:2,class:"d-flex flex-column justify-content-center align-items-center align-self-center"},us=s("p",{class:"fs-6"},"Password Updated",-1),_s={class:"fs-6"},ms=U({__name:"ResetPassword",props:{token:String},setup(b){const C=b,_=F(),M=A(),p=c(!1),m=c(!0),i=c(!1),a=c({user_id:null,password:null,active:null,confirm_password:null,email_id:null,activation_token:null}),L=B(()=>({user:{password:{required:d.withMessage("Password is required",h),minLength:d.withMessage(({$params:e})=>`Password must have a minimum length of ${e.min} characters`,R(6))},confirm_password:{required:d.withMessage("Please confirm your password",h),sameAsPassword:d.withMessage("Passwords does not match",T(a.value.password))}}})),n=j(L,{user:a});z(()=>{V()});const V=async()=>{try{i.value=!0;const e=await g.get("/user/resetpassword/decode/"+C.token);a.value=e.user,a.value&&(p.value=!!a.value.email_id,m.value=!1)}catch(e){e.status==k.NotFound&&M.push("/"),_.error(e.message)}finally{i.value=!1}},q=async()=>{try{if(n.value.user.$touch(),!n.value.user.$invalid){i.value=!0;const e=await g.post("/user/updatepassword",a.value);e.status==k.Ok&&(p.value=!1,_.success(e.message))}}catch(e){_.error(e.message)}finally{i.value=!1}};return(e,l)=>{const N=D("router-link"),S=G;return t(),r("main",J,[K,v((t(),r("div",Q,[m.value?(t(),r("div",W,Y)):!m.value&&p.value?(t(),r(f,{key:1},[Z,s("form",ss,[s("div",es,[s("div",as,[s("div",os,[ts,v(s("input",{type:"password","onUpdate:modelValue":l[0]||(l[0]=o=>a.value.password=o),class:y(["form-control",{"is-invalid":u(n).user.password.$error}]),id:"password"},null,2),[[P,a.value.password]]),(t(!0),r(f,null,x(u(n).user.password.$errors,o=>(t(),r("div",{class:"invalid-feedback",key:o.$uid},$(o.$message),1))),128))])]),s("div",rs,[s("div",ns,[is,v(s("input",{type:"password","onUpdate:modelValue":l[1]||(l[1]=o=>a.value.confirm_password=o),class:y(["form-control",{"is-invalid":u(n).user.confirm_password.$error}]),id:"confirmPassword"},null,2),[[P,a.value.confirm_password]]),(t(!0),r(f,null,x(u(n).user.confirm_password.$errors,o=>(t(),r("div",{class:"invalid-feedback",key:o.$uid},$(o.$message),1))),128))])])]),s("div",ls,[s("button",{class:"btn btn-primary",type:"submit",onClick:E(q,["prevent"])}," Save ",8,cs)])])],64)):(t(),r("div",ds,[us,s("p",_s,[w("Please "),H(N,{class:"spl-link",to:{path:"/"}},{default:I(()=>[w("Login")]),_:1}),w(" to continue")])]))])),[[S,i.value]])])}}});export{ms as default};
