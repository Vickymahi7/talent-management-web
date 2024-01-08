import{d as Z,u as ee,r as u,w as k,o as s,f as se,g as Q,h as t,j as a,k as h,t as c,F as i,L as ye,z as L,G as K,_ as pe,l as E,H as N,m as te,c as q,U as R,M as W,C as B,a as O,e as ke,b as he,q as be,E as ge,i as $,x as p,J as X,v as A,K as Y,n as z,I as fe,B as Ue,A as $e}from"./index-c0797ffd.js";import{r as Ce}from"./bootstrap-vue-next-57b53e13.js";import{f as we}from"./dateFormats-ed53e278.js";const Me={class:"table-responsive"},xe={class:"table table-borderless custom-table-style"},Ee={class:"table-primary"},Pe={class:"custom-tbody-style"},Ve=["onUpdate:modelValue","onChange"],Ie={key:0},Se=t("td",{colspan:"12",class:"text-center"}," No record found ",-1),Te=[Se],Ae=t("button",{class:"btn btn-primary"},"Save",-1),Le=Z({__name:"UserPrivilegeModal",setup(ae,{expose:b}){const M=ee(),P=u(null),v=u(null),C=u(!1),m=u([]),V=u([{key:"main_menu",label:"Main Menu"},{key:"menu",label:"Menu"},{key:"active",label:"Active"}]),I=async d=>{try{C.value=!0;const _=await E.get("/standardprivilege/list/"+d);m.value=_.standardPrivilegeList}catch(_){M.error(_.message)}finally{C.value=!1}},D=async d=>{try{let _={user_menu_privilege_id:d.user_menu_privilege_id,standard_menu_id:d.standard_menu_id,menu_order:d.menu_order,active:d.active,user_id:P.value};C.value=!0;const f=await E.post("/usermenuprivilege/statechange",_);f.status==N.Ok&&(M.success(f.message),I(P.value))}catch(_){M.error(_.message)}finally{C.value=!1}};return b({showModal:d=>{var _;(_=v.value)==null||_.show(),I(d),P.value=d}}),(d,_)=>{const f=te;return k((s(),se(pe,{title:"User Menu Privilege",ref_key:"userPrivilegeModal",ref:v},{body:Q(()=>[t("div",Me,[t("table",xe,[t("thead",Ee,[t("tr",null,[(s(!0),a(i,null,h(V.value,U=>(s(),a("th",{scope:"col",key:U.key},c(U.label),1))),128))])]),t("tbody",Pe,[(s(!0),a(i,null,h(m.value,U=>(s(),a("tr",{key:U.standard_menu_id},[(s(!0),a(i,null,h(V.value,w=>(s(),a("td",{key:w.key},[w.key=="active"?k((s(),a("input",{key:0,class:"form-check-input checkbox-lg mt-0",type:"checkbox","onUpdate:modelValue":S=>U[w.key]=S,onChange:S=>D(U)},null,40,Ve)),[[ye,U[w.key]]]):(s(),a(i,{key:1},[L(c(U[w.key]),1)],64))]))),128))]))),128)),m.value.length==0?(s(),a("tr",Ie,Te)):K("",!0)])])])]),footer:Q(()=>[Ae]),_:1})),[[f,C.value]])}}}),Ne=t("div",{class:"content-card content-header card-gap-mb"},[t("label",null,"Manage User")],-1),De={class:"content-body content-card"},qe={class:"row py-2"},Be={class:"col text-end"},Ke={class:"table-responsive"},Fe={class:"table table-borderless custom-table-style"},Re={class:"table-primary"},Oe={class:"custom-tbody-style"},Ye=["onUpdate:modelValue","onKeyup"],ze={key:1},He={key:0,class:"text-success me-2",title:"User Activated"},je={key:1,class:"text-danger me-2",title:"User Not Activated"},Ge=["onUpdate:modelValue","onKeyup"],Je={key:1},Qe=["onUpdate:modelValue","aria-label"],We=t("option",{value:null},"Select",-1),Xe=["value"],Ze={key:1},es=["onUpdate:modelValue","aria-label"],ss=t("option",{value:null},"Select",-1),ts=["value"],as={key:1},ls=["onClick"],os=["onClick"],ns=["onClick"],rs=["onClick"],is=["onClick"],us={key:0},ds=t("td",{colspan:"12",class:"text-center"}," No record found ",-1),cs=[ds],_s={class:"modal fade",id:"userAddEditModal",tabindex:"-1","aria-labelledby":"modalLabel","aria-hidden":"true"},vs={class:"modal-dialog"},ms={class:"modal-content"},ys=t("div",{class:"modal-header"},[t("h5",{class:"modal-title",id:"modalLabel"},"New User"),t("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1),ps={class:"modal-body"},ks={class:"container"},hs={class:"form-inline"},bs={class:"row"},gs=t("label",{for:"user_name",class:"col-sm-4 col-form-label"},"Display Name",-1),fs={class:"col-sm-8"},Us={class:"row"},$s=t("label",{for:"user_type_id",class:"col-sm-4 col-form-label"},"User Type",-1),Cs={class:"col-sm-8"},ws=t("option",{value:null},"Select",-1),Ms=["value"],xs={class:"row"},Es=t("label",{for:"email_id",class:"col-sm-4 col-form-label"},"Email ID",-1),Ps={class:"col-sm-8"},Vs={class:"row"},Is=t("label",{for:"phone",class:"col-sm-4 col-form-label"},"Phone",-1),Ss={class:"col-sm-8"},Ns=Z({__name:"UserManagement",setup(ae){const b=ee(),M=$e(),P=u(null),v=u(!1),C=u(!1),m=u(null),V=u(null),I=u(null),D=u(""),g=u({user_id:null,user_type_id:null,user_name:null,email_id:null,phone:null,user_status_id:null}),d=u([]),_=u([{key:"user_id",label:"ID"},{key:"user_name",label:"Display Name",isEditable:!0},{key:"email_id",label:"Email ID",isEditable:!0},{key:"user_type_id",label:"User Type",isEditable:!0},{key:"user_status_id",label:"Status",isEditable:!0},{key:"last_updated_dt",label:"Last Updated"},{key:"actions",label:"Action"}]),f=u({id:0}),U=u(1),w=u(1),S=u(10),le=q(()=>{const l=localStorage.getItem("userTypeId");return l?parseInt(l):null}),H=q(()=>le.value==R.SAD?W.filter(l=>l.id==R.SAD):W.filter(l=>l.id!=R.SAD)),j=q(()=>{const l=(w.value-1)*S.value,o=l+S.value;return d.value.slice(l,o)}),oe=q(()=>({user:{user_name:{required:B.withMessage("Display Name is required",O)},email_id:{required:B.withMessage("Email ID is required",O),email:B.withMessage("Enter a valid Email ID",ke)},user_type_id:{required:B.withMessage("User Type is required",O)}}})),x=he(oe,{user:g});be(()=>{T()});const T=async()=>{try{v.value=!0;const l=await E.get("/user/list");d.value=l.userList,U.value=d.value.length}catch(l){b.error(l.message)}finally{v.value=!1}},ne=async()=>{try{if(x.value.user.$touch(),!x.value.user.$invalid){C.value=!0;const l=await E.post("/user/add",g.value);l.status==N.Created&&(b.success(l.message),T(),M.bsModalHide(D.value))}}catch(l){b.error(l.message)}finally{C.value=!1}},F=async l=>{try{const o={};o.user_id=l.user_id,o.user_name=l.user_name,o.email_id=l.email_id,o.user_name=l.user_name,o.email_id=l.email_id,o.user_type_id=l.user_type_id,o.user_status_id=l.user_status_id,v.value=!0;const y=await E.patch("/user/update",o);y.status==N.Ok&&(b.success(y.message),T(),m.value=null,V.value=null,I.value=null)}catch(o){b.error(o.message)}finally{v.value=!1}},re=l=>{f.value.id=l},ie=async()=>{try{v.value=!0;const l=await E.delete("/user/delete/"+f.value.id);l.status==N.Ok&&(b.success(l.message),T())}catch(l){b.error(l.message)}finally{v.value=!1}},ue=l=>{f.value.id=l},de=async()=>{try{v.value=!0;const l=await E.post("/user/resendactivation/"+f.value.id);l.status==N.Ok&&(b.success(l.message),T())}catch(l){b.error(l.message)}finally{v.value=!1}},ce=(l,o)=>{m.value=o.user_id,V.value=l.key,I.value=o[l.key]},_e=()=>{m.value=null,V.value=null,I.value=null},ve=l=>{var o;(o=P.value)==null||o.showModal(l)};return(l,o)=>{const y=ge("font-awesome-icon"),me=Ce,G=fe,J=te;return s(),a(i,null,[Ne,k((s(),a("div",De,[t("div",qe,[t("div",Be,[t("button",{class:"btn btn-primary mx-2",type:"button",onClick:o[0]||(o[0]=e=>{$(M).bsModalShow("userAddEditModal"),D.value="userAddEditModal"})},[p(y,{class:"me-2",icon:"fa-solid fa-plus-circle"}),L(" New User ")])])]),t("div",Ke,[t("table",Fe,[t("thead",Re,[t("tr",null,[(s(!0),a(i,null,h(_.value,e=>(s(),a("th",{scope:"col",key:e.key},c(e.label),1))),128))])]),t("tbody",Oe,[(s(!0),a(i,null,h(j.value,e=>(s(),a("tr",{key:e},[(s(!0),a(i,null,h(_.value,n=>(s(),a("td",{key:n.key},[n.key=="user_name"?(s(),a(i,{key:0},[m.value==e.user_id?k((s(),a("input",{key:0,type:"text",class:"form-control form-control-sm","onUpdate:modelValue":r=>e[n.key]=r,placeholder:"Enter Name",onKeyup:X(r=>F(e),["enter"])},null,40,Ye)),[[A,e[n.key]]]):(s(),a("div",ze,[e.active?(s(),a("span",He,[p(y,{icon:"fa-solid fa-user-check"})])):(s(),a("span",je,[p(y,{icon:"fa-solid fa-user-xmark"})])),L(" "+c(e[n.key]),1)]))],64)):n.key=="email_id"?(s(),a(i,{key:1},[m.value==e.user_id?k((s(),a("input",{key:0,type:"email",class:"form-control form-control-sm","onUpdate:modelValue":r=>e[n.key]=r,placeholder:"Enter Email Id",onKeyup:X(r=>F(e),["enter"])},null,40,Ge)),[[A,e[n.key]]]):(s(),a("div",Je,c(e[n.key]),1))],64)):n.key=="user_type_id"?(s(),a(i,{key:2},[m.value==e.user_id?k((s(),a("select",{key:0,class:"form-select form-control-sm","onUpdate:modelValue":r=>e[n.key]=r,"aria-label":n.label},[We,(s(!0),a(i,null,h(H.value,r=>(s(),a("option",{key:r.id,value:r.id},c(r.userType),9,Xe))),128))],8,Qe)),[[Y,e[n.key]]]):(s(),a("span",Ze,c($(M).getUserTypeById(e[n.key])),1))],64)):n.key=="user_status_id"?(s(),a(i,{key:3},[m.value==e.user_id?k((s(),a("select",{key:0,class:"form-select form-control-sm","onUpdate:modelValue":r=>e[n.key]=r,"aria-label":n.label},[ss,(s(!0),a(i,null,h($(Ue),r=>(s(),a("option",{key:r.id,value:r.id},c(r.status),9,ts))),128))],8,es)),[[Y,e[n.key]]]):(s(),a("span",as,c($(M).getUserStatusById(e[n.key])),1))],64)):n.key=="last_updated_dt"?(s(),a(i,{key:4},[L(c($(we)(e[n.key])),1)],64)):n.key=="actions"?(s(),a(i,{key:5},[m.value==e.user_id?(s(),a(i,{key:0},[t("span",{class:"icon-btn mx-1",onClick:r=>F(e)},[p(y,{icon:"fa-solid fa-check"})],8,ls),t("span",{class:"icon-btn",onClick:o[1]||(o[1]=r=>_e())},[p(y,{icon:"fa-solid fa-xmark"})])],64)):(s(),a(i,{key:1},[e.active?K("",!0):(s(),a("div",{key:0,class:"icon-btn me-2",onClick:r=>ue(e.user_id),title:"Resend Activation Mail","data-bs-toggle":"modal","data-bs-target":"#resendConfirmation"},[p(y,{icon:"fa-solid fa-share-from-square"})],8,os)),t("div",{class:"icon-btn me-2",onClick:r=>ce(n,e),title:"Edit User"},[p(y,{icon:"fa-solid fa-pencil-alt"})],8,ns),t("div",{class:"icon-btn me-2",onClick:r=>re(e.user_id),title:"Delete User","data-bs-toggle":"modal","data-bs-target":"#deleteUser"},[p(y,{icon:"fa-solid fa-trash"})],8,rs),t("div",{class:"icon-btn me-2",onClick:r=>ve(e.user_id),title:"User Privileges"},[p(y,{icon:"fa-solid fa-cog"})],8,is)],64))],64)):(s(),a(i,{key:6},[L(c(e[n.key]),1)],64))]))),128))]))),128)),j.value.length==0?(s(),a("tr",us,cs)):K("",!0)])])]),d.value.length>0?(s(),se(me,{key:0,modelValue:w.value,"onUpdate:modelValue":o[2]||(o[2]=e=>w.value=e),pills:"","total-rows":U.value,"per-page":S.value,size:"sm"},null,8,["modelValue","total-rows","per-page"])):K("",!0)])),[[J,v.value]]),t("div",_s,[t("div",vs,[k((s(),a("div",ms,[ys,t("div",ps,[t("div",ks,[t("form",hs,[t("div",bs,[gs,t("div",fs,[k(t("input",{type:"text",class:z(["form-control",{"is-invalid":$(x).user.user_name.$error}]),"onUpdate:modelValue":o[3]||(o[3]=e=>g.value.user_name=e),id:"user_name",placeholder:"Enter Display Name"},null,2),[[A,g.value.user_name]]),(s(!0),a(i,null,h($(x).user.user_name.$errors,e=>(s(),a("div",{class:"invalid-feedback",key:e.$uid},c(e.$message),1))),128))])]),t("div",Us,[$s,t("div",Cs,[k(t("select",{class:z(["form-select",{"is-invalid":$(x).user.user_type_id.$error}]),"onUpdate:modelValue":o[4]||(o[4]=e=>g.value.user_type_id=e),"aria-label":"User Type"},[ws,(s(!0),a(i,null,h(H.value,e=>(s(),a("option",{key:e.id,value:e.id},c(e.userType),9,Ms))),128))],2),[[Y,g.value.user_type_id]]),(s(!0),a(i,null,h($(x).user.user_type_id.$errors,e=>(s(),a("div",{class:"invalid-feedback",key:e.$uid},c(e.$message),1))),128))])]),t("div",xs,[Es,t("div",Ps,[k(t("input",{type:"email",class:z(["form-control",{"is-invalid":$(x).user.email_id.$error}]),"onUpdate:modelValue":o[5]||(o[5]=e=>g.value.email_id=e),id:"email_id",placeholder:"Enter Email ID"},null,2),[[A,g.value.email_id]]),(s(!0),a(i,null,h($(x).user.email_id.$errors,e=>(s(),a("div",{class:"invalid-feedback",key:e.$uid},c(e.$message),1))),128))])]),t("div",Vs,[Is,t("div",Ss,[k(t("input",{type:"tet",class:"form-control","onUpdate:modelValue":o[6]||(o[6]=e=>g.value.phone=e),id:"phone",placeholder:"Enter Phone Number"},null,512),[[A,g.value.phone]])])])])])]),t("div",{class:"modal-footer"},[t("button",{type:"button",onClick:ne,class:"btn btn-primary"},"Save")])])),[[J,C.value]])])]),p(Le,{ref_key:"userPrivilegeRef",ref:P},null,512),p(G,{id:"deleteUser",onYes:ie,returnParams:f.value,title:"Delete Confirmation",message:"Are you sure to delete user?"},null,8,["returnParams"]),p(G,{id:"resendConfirmation",onYes:de,returnParams:f.value,title:"Mail Resend Confirmation",message:"Are you sure to resend activation mail?"},null,8,["returnParams"])],64)}}});export{Ns as default};