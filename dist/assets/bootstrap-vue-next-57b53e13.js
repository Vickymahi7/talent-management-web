import{d as J,c as y,a3 as xe,a4 as ue,r as re,a5 as Pe,a6 as we,a7 as Ce,a8 as se,a9 as G,V as R,aa as C,R as Ne,$ as Ee}from"./index-c0797ffd.js";var $e=Object.defineProperty,Te=(e,t,n)=>t in e?$e(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,b=(e,t,n)=>(Te(e,typeof t!="symbol"?t+"":t,n),n);const Oe=e=>typeof e=="boolean"?e:e===""||e==="true";class Q{constructor(t,n={}){if(b(this,"cancelable",!0),b(this,"componentId",null),b(this,"_defaultPrevented",!1),b(this,"eventType",""),b(this,"nativeEvent",null),b(this,"_preventDefault"),b(this,"relatedTarget",null),b(this,"target",null),!t)throw new TypeError(`Failed to construct '${this.constructor.name}'. 1 argument required, ${arguments.length} given.`);Object.assign(this,Q.Defaults,n,{eventType:t}),this._preventDefault=function(){this.cancelable&&(this.defaultPrevented=!0)}}get defaultPrevented(){return this._defaultPrevented}set defaultPrevented(t){this._defaultPrevented=t}get preventDefault(){return this._preventDefault}set preventDefault(t){this._preventDefault=t}static get Defaults(){return{cancelable:!0,componentId:null,eventType:"",nativeEvent:null,relatedTarget:null,target:null}}}const ie=typeof window<"u",ke=typeof document<"u",Be=typeof Element<"u",Le=typeof navigator<"u",Me=ie&&ke&&Le,Z=ie?window:{};(()=>{let e=!1;if(Me)try{const t={get passive(){return e=!0,e}};Z.addEventListener("test",t,t),Z.removeEventListener("test",t,t)}catch{e=!1}return e})();const oe=typeof window<"u",Ve=typeof document<"u",_e=typeof navigator<"u",De=oe&&Ve&&_e,K=oe?window:{};(()=>{let e=!1;if(De)try{const t={get passive(){e=!0}};K.addEventListener("test",t,t),K.removeEventListener("test",t,t)}catch{e=!1}return e})();const h=Be?Element.prototype:void 0,Ge=(h==null?void 0:h.matches)||(h==null?void 0:h.msMatchesSelector)||(h==null?void 0:h.webkitMatchesSelector),Re=e=>!!(e&&e.nodeType===Node.ELEMENT_NODE),je=(e,t)=>Re(e)?Ge.call(e,t):!1;h!=null&&h.closest;const j=(e,t,n)=>t.concat(["sm","md","lg","xl","xxl"]).reduce((a,u)=>(a[e?`${e}${u.charAt(0).toUpperCase()+u.slice(1)}`:u]=n,a),Object.create(null)),pe=(e,t,n,a=n)=>Object.keys(t).reduce((u,o)=>(e[o]&&u.push([a,o.replace(n,""),e[o]].filter(v=>v&&typeof v!="boolean").join("-").toLowerCase()),u),[]),q=(e,t={},n={})=>{const a=[e];let u;for(let o=0;o<a.length&&!u;o++){const v=a[o];u=n[v]}return u&&typeof u=="function"?u(t):u},U=(e,t=NaN)=>Number.isInteger(e)?e:t;function ve(e,t){var n;const a=Pe();return we(()=>{a.value=e()},{...t,flush:(n=t==null?void 0:t.flush)!=null?n:"sync"}),Ce(a)}function ce(e){let t=!1,n;const a=xe(!0);return(...u)=>(t||(n=a.run(()=>e(...u)),t=!0),n)}const ze=e=>typeof e<"u";function Ae(e){return JSON.parse(JSON.stringify(e))}function Fe(e,t,n,a={}){var u,o,v;const{clone:N=!1,passive:g=!1,eventName:z,deep:M=!1,defaultValue:A,shouldEmit:i}=a,p=Ne(),T=n||(p==null?void 0:p.emit)||((u=p==null?void 0:p.$emit)==null?void 0:u.bind(p))||((v=(o=p==null?void 0:p.proxy)==null?void 0:o.$emit)==null?void 0:v.bind(p==null?void 0:p.proxy));let c=z;t||(t="modelValue"),c=c||`update:${t.toString()}`;const V=d=>N?typeof N=="function"?N(d):Ae(d):d,_=()=>ze(e[t])?V(e[t]):A,O=d=>{i?i(d)&&T(c,d):T(c,d)};if(g){const d=_(),k=re(d);let x=!1;return R(()=>e[t],l=>{x||(x=!0,k.value=V(l),Ee(()=>x=!1))}),R(k,l=>{!x&&(l!==e[t]||M)&&O(l)},{deep:M}),k}else return y({get(){return _()},set(d){O(d)}})}const de=e=>ve(()=>{const t=se(e);return t?`justify-content-${t}`:""});function S(e){return ve(()=>{const t=se(e);return t==null?t:Oe(t)})}ce(()=>{const e=ue([]);return{items:e,reset:()=>{e.splice(0,e.length)}}});const He="top-right";ce(()=>{const e=re([]);return{toasts:e,show:(...[t,n])=>{const a={pos:He};typeof t=="string"?Object.assign(a,n,{body:t,value:(n==null?void 0:n.value)||5e3}):Object.assign(a,t,{value:t.value||5e3});const u=Symbol();return e.value.push({...a,self:u}),u},hide:t=>{const n=e.value.findIndex(a=>a.self===t);n!==-1&&e.value.splice(n,1)}}});const X=j("",[],{type:[Boolean,String,Number],default:!1}),ee=j("offset",[""],{type:[String,Number],default:null}),te=j("order",[""],{type:[String,Number],default:null});J({name:"BCol",slots:Object,props:{col:{type:[Boolean,String],default:!1},cols:{type:[String,Number],default:null},...X,offset:{type:[String,Number],default:null},...ee,order:{type:[String,Number],default:null},...te,alignSelf:{type:String,default:null},tag:{type:String,default:"div"}},setup(e){const t=[{content:X,propPrefix:"cols",classPrefix:"col"},{content:ee,propPrefix:"offset"},{content:te,propPrefix:"order"}],n=S(()=>e.col),a=y(()=>t.flatMap(u=>pe(e,u.content,u.propPrefix,u.classPrefix)));return{computedClasses:y(()=>[a.value,{col:n.value||!a.value.some(u=>/^col-/.test(u))&&!e.cols,[`col-${e.cols}`]:!!e.cols,[`offset-${e.offset}`]:!!e.offset,[`order-${e.order}`]:!!e.order,[`align-self-${e.alignSelf}`]:!!e.alignSelf}])}}});["ar","az","ckb","fa","he","ks","lrc","mzn","ps","sd","te","ug","ur","yi"].map(e=>e.toLowerCase());const Ie=5,fe=20,ge=0,m=3,Ye="ellipsis-text",qe="first-text",Je="last-text",Qe="next-text",Ue="page",We="prev-text",le=e=>Math.max(U(e)||fe,1),ae=e=>Math.max(U(e)||ge,0),Ze=(e,t)=>{const n=U(e)||1;return n>t?t:n<1?1:n},Xe=J({name:"BPagination",props:{align:{type:String,default:"start"},ariaControls:{type:String,default:void 0},ariaLabel:{type:String,default:"Pagination"},disabled:{type:[Boolean,String],default:!1},ellipsisClass:{type:[Array,String],default:()=>[]},ellipsisText:{type:String,default:"…"},firstClass:{type:[Array,String],default:()=>[]},firstNumber:{type:[Boolean,String],default:!1},firstText:{type:String,default:"«"},hideEllipsis:{type:[Boolean,String],default:!1},hideGotoEndButtons:{type:[Boolean,String],default:!1},labelFirstPage:{type:String,default:"Go to first page"},labelLastPage:{type:String,default:"Go to last page"},labelNextPage:{type:String,default:"Go to next page"},labelPage:{type:String,default:"Go to page"},labelPrevPage:{type:String,default:"Go to previous page"},lastClass:{type:[Array,String],default:()=>[]},lastNumber:{type:[Boolean,String],default:!1},lastText:{type:String,default:"»"},limit:{type:Number,default:Ie},modelValue:{type:Number,default:1},nextClass:{type:[Array,String],default:()=>[]},nextText:{type:String,default:"›"},pageClass:{type:[Array,String],default:()=>[]},perPage:{type:Number,default:fe},pills:{type:[Boolean,String],default:!1},prevClass:{type:[Array,String],default:()=>[]},prevText:{type:String,default:"‹"},size:{type:String,default:"md"},totalRows:{type:Number,default:ge}},emits:["update:modelValue","page-click"],setup(e,{emit:t,slots:n}){const a=Fe(e,"modelValue",t),u=S(()=>e.disabled),o=S(()=>e.firstNumber),v=S(()=>e.hideEllipsis),N=S(()=>e.hideGotoEndButtons),g=S(()=>e.lastNumber),z=S(()=>e.pills),M=G(()=>e.align==="fill"?"start":e.align),A=de(M),i=G(()=>Math.ceil(ae(e.totalRows)/le(e.perPage))),p=y(()=>{let l;return i.value-a.value+2<e.limit&&e.limit>m?l=i.value-c.value+1:l=a.value-Math.floor(c.value/2),l<1?l=1:l>i.value-c.value&&(l=i.value-c.value+1),e.limit<=m&&g.value&&i.value===l+c.value-1&&(l=Math.max(l-1,1)),l}),T=y(()=>{const l=i.value-a.value;let r=!1;return l+2<e.limit&&e.limit>m?e.limit>m&&(r=!0):e.limit>m&&(r=!!(!v.value||o.value)),p.value<=1&&(r=!1),r&&o.value&&p.value<4&&(r=!1),r}),c=y(()=>{let l=e.limit;return i.value<=e.limit?l=i.value:a.value<e.limit-1&&e.limit>m?((!v.value||g.value)&&(l=e.limit-(o.value?0:1)),l=Math.min(l,e.limit)):i.value-a.value+2<e.limit&&e.limit>m?(!v.value||o.value)&&(l=e.limit-(g.value?0:1)):e.limit>m&&(l=e.limit-(v.value?0:2)),l}),V=y(()=>{const l=i.value-c.value;let r=!1;a.value<e.limit-1&&e.limit>m?(!v.value||g.value)&&(r=!0):e.limit>m&&(r=!!(!v.value||g.value)),p.value>l&&(r=!1);const E=p.value+c.value-1;return r&&g.value&&E>i.value-3&&(r=!1),r}),_=ue({pageSize:le(e.perPage),totalRows:ae(e.totalRows),numberOfPages:i.value}),O=(l,r)=>{if(r===a.value)return;const{target:E}=l,$=new Q("page-click",{cancelable:!0,target:E});t("page-click",$,r),!$.defaultPrevented&&(a.value=r)},d=G(()=>e.size?`pagination-${e.size}`:""),k=G(()=>z.value?"b-pagination-pills":"");R(a,l=>{const r=Ze(l,i.value);r!==a.value&&(a.value=r)}),R(_,(l,r)=>{l!=null&&(r.pageSize!==l.pageSize&&r.totalRows===l.totalRows||r.numberOfPages!==l.numberOfPages&&a.value>r.numberOfPages)&&(a.value=1)});const x=y(()=>{const l=[];for(let r=0;r<c.value;r++)l.push({number:p.value+r,classes:null});return l});return()=>{const l=[],r=x.value.map(s=>s.number),E=s=>s===a.value,$=a.value<1,P=e.align==="fill",D=(s,B,w,H,I,Y)=>{const f=u.value||E(Y)||$||s<1||s>i.value,L=s<1?1:s>i.value?i.value:s,be={disabled:f,page:L,index:L-1},he=q(w,be,n)||H||"";return C("li",{class:["page-item",{disabled:f,"flex-fill":P,"d-flex":P&&!f},I]},C(f?"span":"button",{class:["page-link",{"flex-grow-1":!f&&P}],"aria-label":B,"aria-controls":e.ariaControls||null,"aria-disabled":f?!0:null,role:"menuitem",type:f?null:"button",tabindex:f?null:"-1",onClick:Se=>{f||O(Se,L)}},he))},W=s=>C("li",{class:["page-item","disabled","bv-d-xs-down-none",P?"flex-fill":"",e.ellipsisClass],role:"separator",key:`ellipsis-${s?"last":"first"}`},[C("span",{class:["page-link"]},q(Ye,{},n)||e.ellipsisText||"...")]),F=(s,B)=>{const w=E(s.number)&&!$,H=u.value?null:w||$&&B===0?"0":"-1",I={active:w,disabled:u.value,page:s.number,index:s.number-1,content:s.number},Y=q(Ue,I,n)||s.number,f=C(u.value?"span":"button",{class:["page-link",{"flex-grow-1":!u.value&&P}],"aria-controls":e.ariaControls||null,"aria-disabled":u.value?!0:null,"aria-label":e.labelPage?`${e.labelPage} ${s.number}`:null,role:"menuitemradio",type:u.value?null:"button",tabindex:H,onClick:L=>{u.value||O(L,s.number)}},Y);return C("li",{class:["page-item",{disabled:u.value,active:w,"flex-fill":P,"d-flex":P&&!u.value},e.pageClass],role:"presentation",key:`page-${s.number}`},f)};if(!N.value&&!o.value){const s=D(1,e.labelFirstPage,qe,e.firstText,e.firstClass,1);l.push(s)}const me=D(a.value-1,e.labelFirstPage,We,e.prevText,e.prevClass,1);l.push(me),o.value&&r[0]!==1&&l.push(F({number:1},0)),T.value&&l.push(W(!1)),x.value.forEach((s,B)=>{const w=T.value&&o.value&&r[0]!==1?1:0;l.push(F(s,B+w))}),V.value&&l.push(W(!0)),g.value&&r[r.length-1]!==i.value&&l.push(F({number:i.value},-1));const ye=D(a.value+1,e.labelNextPage,Qe,e.nextText,e.nextClass,i.value);if(l.push(ye),!g.value&&!N.value){const s=D(i.value,e.labelLastPage,Je,e.lastText,e.lastClass,i.value);l.push(s)}return C("ul",{class:["pagination",d.value,A.value,k.value],role:"menubar","aria-disabled":u.value,"aria-label":e.ariaLabel||null},l)}}}),ne=j("cols",[""],{type:[String,Number],default:null});J({name:"BRow",slots:Object,props:{tag:{type:String,default:"div"},gutterX:{type:String,default:null},gutterY:{type:String,default:null},noGutters:{type:[Boolean,String],default:!1},alignV:{type:String,default:null},alignH:{type:String,default:null},alignContent:{type:String,default:null},...ne},setup(e){const t=S(()=>e.noGutters),n=de(()=>e.alignH),a=y(()=>pe(e,ne,"cols","row-cols"));return{computedClasses:y(()=>[a.value,{[`gx-${e.gutterX}`]:e.gutterX!==null,[`gy-${e.gutterY}`]:e.gutterY!==null,"g-0":t.value,[`align-items-${e.alignV}`]:e.alignV!==null,[n.value]:e.alignH!==null,[`align-content-${e.alignContent}`]:e.alignContent!==null}])}}});export{Xe as r};
