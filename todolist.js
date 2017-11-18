
var Storage = {
	save(key,value){
		return localStorage.setItem(key,JSON.stringify(value));
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key))||[];
	}
};

var list = Storage.fetch("TODOLIST");
var vm = new Vue({
	el:'#wrapper',
	data:{
		list:list,
		todo:'', 
		editListItem:'',
		beforeListItemLabel:'',
		hash:'',
		listFilter:''
	},
	computed:{
		listFilterLength:function(){
			return this.list.filter(function(item) {
				return !item.isChecked;
			}).length;
		},
	},
	watch:{
		list:{
			handler(){
				Storage.save("TODOLIST",this.list);
			},
			deep:true
		},
		hash:function(){
			switch(this.hash){
				case 'all':this.listFilter=this.list;break;
				case 'unfinished':this.listFilter=this.list.filter(function(item){
						return !item.isChecked;
					});break;
				case 'finished':this.listFilter=this.list.filter(function(item){
						return item.isChecked;
					});break;
				default:this.listFilter=this.list;break;
			}
		}
	},
	methods:{
		addListItem(label){
			this.list.push({
				label:label,
				isChecked:false
			})
			this.todo=""
			window.location.hash='all';
		},
		deleteListItem(item){
			this.list.splice(this.list.indexOf(item),1);
			if(this.hash==='finished'||this.hash==='unfinished'){
				this.listFilter.splice(this.listFilter.indexOf(item),1);
			}
		},
		deleteAll(){
			if(confirm("你确定删除所以任务吗？")){
				this.list=[];
			}
		},
		edit(item){
			this.beforeListItemLabel = item.label;
			this.editListItem = item;
		},
		editEnd(){
			this.editListItem='';
		},
		editCancel(item){
			item.label=this.beforeListItemLabel;
			this.editListItem='';
		}
	},
	directives:{
		'focus':{
			update(el,binding){
				if(binding.value){
					el.focus();
				}
			}
		}
	}
})
getHash();
function getHash(){
	vm.hash = location.hash.slice(1);
};
window.addEventListener("hashchange",getHash);
