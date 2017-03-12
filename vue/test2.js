var dataList=[
	{
		tit:"123",
		isChecked:true//选中
	},
	{
		tit:"456",
		isChecked:false//不选中
	}
];
new Vue({
	el:".main",
	data:{
		list:dataList,
		cont:"",//输入的当前内容
		editCont:"",//存储编辑框内容
		curCont:""//编辑前，存储临时编辑区块之内容
	},
	methods:{//事件方法
		addCont:function (){//添加内容
			if(!this.cont) return;

			this.list.push({
				tit:this.cont,
				isChecked:false
			});
			this.cont="";
		},
		removeCont:function (currVal){//删除内容
			//查找当前数据是第几项
			var index=this.list.indexOf(currVal);
			this.list.splice(index,1);
		},
		editStatus:function(currVal){//展示输入框
			this.editCont=currVal;
			this.curCont=currVal.tit;
		},
		editSuccess:function (ev){//编辑成功
			console.log(ev.type);
			if(!this.cont) return;
			this.editCont="";
		}
		,editFail:function (currVal){//编辑失败
			currVal.tit=this.curCont;
			this.curCont="";
			this.editCont="";
		}
	},
	directives:{//自定义指令
		focus:{
			update(el,binding){
				console.log(el);
				console.log(binding);

			}
		}
	}
});