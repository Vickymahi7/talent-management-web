import{b as w,u as y,C as l,a as u,N as $,O as b,l as c,H as m,D as U,o,j as a,w as n,h as s,n as h,v as d,F as p,k as _,s as k,y as L,m as P,t as v}from"./index-c0797ffd.js";const x={props:{token:String},data(){return{v$:w(),toast:y(),showActivationForm:!1,isActiveUser:!1,isLoading:!1,email_id:"",user:{user_id:null,email_id:"",user_name:"",phone:"",password:"",confirm_password:"",active:!1}}},validations(){return{user:{user_name:{required:l.withMessage("Display Name is required",u)},password:{required:l.withMessage("Password is required",u),minLength:l.withMessage(({$params:i})=>`Password must have a minimum length of ${i.min} characters`,$(6))},confirm_password:{required:l.withMessage("Please confirm your password",u),sameAsPassword:l.withMessage("Passwords does not match",b(this.user.password))}}}},mounted(){this.getUser()},methods:{async getUser(){try{const i={key:this.token};this.isLoading=!0;const r=await c.post("/user/inviteduser/decode",i);this.user=r.user,this.user&&(this.email_id=this.user.email_id??"",this.showActivationForm=!this.user.active,this.isActiveUser=this.user.active??!1)}catch(i){i.status==m.NotFound&&this.$router.push("/"),this.toast.error(i.message)}finally{this.isLoading=!1}},async registerInvitedUser(){try{if(this.v$.user.$touch(),!this.v$.user.$invalid){this.isLoading=!0;const i=await c.post("/user/inviteduser/register",this.user);i.status==m.Created&&(this.toast.success(i.message),setTimeout(()=>{this.$router.push("/")},3e3))}}catch(i){this.toast.error(i.message)}finally{this.isLoading=!1}},async activateUser(){try{if(this.v$.user.$touch(),!this.v$.user.$invalid){this.isLoading=!0;const i=await c.post("/user/activate",this.user);i.status==m.Ok&&(this.showActivationForm=!1,this.toast.success(i.message),setTimeout(()=>{this.$router.push("/")},3e3))}}catch(i){this.toast.error(i.message)}finally{this.isLoading=!1}}}},A={class:"login-container mt-3"},I=s("img",{src:L,alt:""},null,-1),M={class:"login-section h-100 w-100"},N=s("h4",{class:"text-center"},"User Registration",-1),V={class:"p-3"},q={class:"row"},C={class:"col-12"},D={class:"form-group"},E=s("label",{for:"user_name"},"Name",-1),F={class:"col-12"},S={class:"form-group"},T=s("label",{for:"email_id"},"Email ID",-1),B={class:"col-12"},H={class:"form-group"},O=s("label",{for:"phone"},"Phone",-1),R={class:"col-12"},j={class:"form-group"},z=s("label",{for:"password"},"Password",-1),G={class:"col-12"},J={class:"form-group"},K=s("label",{for:"confirmPassword"},"Confirm Password",-1),Q={class:"text-center mt-3"};function W(i,r,X,Y,t,f){const g=P;return o(),a("main",A,[I,n((o(),a("div",M,[N,s("form",V,[s("div",q,[s("div",C,[s("div",D,[E,n(s("input",{type:"text",class:h(["form-control",{"is-invalid":t.v$.user.user_name.$error}]),"onUpdate:modelValue":r[0]||(r[0]=e=>t.user.user_name=e),id:"user_name",placeholder:"Enter Name"},null,2),[[d,t.user.user_name]]),(o(!0),a(p,null,_(t.v$.user.user_name.$errors,e=>(o(),a("div",{class:"invalid-feedback",key:e.$uid},v(e.$message),1))),128))])]),s("div",F,[s("div",S,[T,n(s("input",{type:"email",class:"form-control","onUpdate:modelValue":r[1]||(r[1]=e=>t.email_id=e),disabled:"",id:"email_id",placeholder:"Enter Email ID"},null,512),[[d,t.email_id]])])]),s("div",B,[s("div",H,[O,n(s("input",{type:"tet",class:"form-control","onUpdate:modelValue":r[2]||(r[2]=e=>t.user.phone=e),id:"phone",placeholder:"Enter Phone Number"},null,512),[[d,t.user.phone]])])]),s("div",R,[s("div",j,[z,n(s("input",{type:"password","onUpdate:modelValue":r[3]||(r[3]=e=>t.user.password=e),class:h(["form-control",{"is-invalid":t.v$.user.password.$error}]),id:"password"},null,2),[[d,t.user.password]]),(o(!0),a(p,null,_(t.v$.user.password.$errors,e=>(o(),a("div",{class:"invalid-feedback",key:e.$uid},v(e.$message),1))),128))])]),s("div",G,[s("div",J,[K,n(s("input",{type:"password","onUpdate:modelValue":r[4]||(r[4]=e=>t.user.confirm_password=e),class:h(["form-control",{"is-invalid":t.v$.user.confirm_password.$error}]),id:"confirmPassword"},null,2),[[d,t.user.confirm_password]]),(o(!0),a(p,null,_(t.v$.user.confirm_password.$errors,e=>(o(),a("div",{class:"invalid-feedback",key:e.$uid},v(e.$message),1))),128))])])]),s("div",Q,[s("button",{class:"btn btn-primary",type:"submit",onClick:r[5]||(r[5]=k((...e)=>f.registerInvitedUser&&f.registerInvitedUser(...e),["prevent"]))}," Save ")])])])),[[g,t.isLoading]])])}const ss=U(x,[["render",W]]);export{ss as default};