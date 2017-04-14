function Webdb(obj){
	var defaults={
		name:"mydb",
		version:"1.0",
		describe:"Test DB",
		size:2,
		callback:function (){}
	};
	this.data=this.extend(defaults,obj);
	if(window.openDatabase){
		this.openDB();
	}else{
		console.log("该浏览器不支持web sql");
		return;
	}
} 
//打开数据库
Webdb.prototype.openDB=function (){
	var oData=this.data;
	this.db=openDatabase(oData.name,oData.version,oData.describe,Number(oData.size) * 1024 * 1024); 
};
//操作数据库
Webdb.prototype.operate=function (obj){
	var This=this;
	if(!window.openDatabase){
		console.log("该浏览器不支持web sql的db");
		return;
	}
	This.db.transaction(function (tx) {
		var sTableName=obj.tableName;
		var sType=obj.type.toLowerCase();
		var aKey=obj.aKey;//创建表的key

		var sCreateKey="";//临时变量--创建表
		var sInsertKey="";//添加时Key
		var sVal="";//添加时val
		var sSetKey="";//修改字段
		var oWhere=null;//查询条件

		var success=obj.success;
		var error=obj.error;
		switch(sType){
			case "create":
			for(var i=0;i<aKey.length;i++){
				if(i==0){
					 sCreateKey+=aKey[i]+" unique, ";
				}else{
					sCreateKey+=aKey[i]+", ";
				}
			}
			sCreateKey=sCreateKey.replace(/\, $/mg,'');
			//console.log('CREATE TABLE IF NOT EXISTS '+sTableName+' ('+sCreateKey+')');
			tx.executeSql('create table if not exists '+sTableName+' ('+sCreateKey+')',[],function(tx,rs){
	           		success && success(rs,tx);
	        },function(){
	        		error && error();
	        });
			break;

			case "insert":
			for(var o in obj.data){
				sInsertKey+=o+", ";
				sVal+='"'+obj.data[o]+'",';
			}
			sInsertKey=sInsertKey.replace(/\, $/mg,"");
			sVal=sVal.replace(/\,$/mg,"");
			//console.log('insert into '+sTableName+' ('+sInsertKey+') values ('+sVal+')');
			tx.executeSql('insert into '+sTableName+' ('+sInsertKey+') values ('+sVal+')',[],function(tx,rs){
	           		//console.log(rs.rows);
	           		success && success(rs,tx);
	        },function(){
	        		error && error();
	        });
			break;

			case "update":
			for(var o in obj.setData){
				sSetKey=o+'=\"'+obj.setData[o]+'\" ';
			}
			oWhere=This.keyAnd(obj.where);
			//console.log('update '+sTableName+' set '+sSetKey+' where '+oWhere.key);
			//console.log(oWhere.val);
			tx.executeSql('update '+sTableName+' set '+sSetKey+' where '+oWhere.key,oWhere.val,function(tx,rs){
	           		success && success(rs,tx);
	        },function(){
	        		error && error();
	        });
			break;

			case "select":
			oWhere=This.keyAnd(obj.where);
			console.log('select * from '+sTableName+' where '+oWhere.key,oWhere.val);
			tx.executeSql('select * from '+sTableName+' where '+oWhere.key,oWhere.val,function(tx,rs){
	           		console.log(rs)
	           		success && success(rs,tx);
	        },function(){
	        		error && error();
	        });
			break;

			case "add":
			for(var o in obj.addData){
				tx.executeSql('alter table '+sTableName+' add column '+o);
			}
			oWhere=This.keyAnd(obj.where);
			//console.log('select * from '+sTableName+' where '+oWhere.key,oWhere.val);
			var oJson={};
			oJson.where={};
			oJson.where=This.extend(oJson.where,obj.where);
			oJson.type="select";
			oJson.tableName=obj.tableName;
			oJson.success=function (rs){
				var oData={};
				oData.tableName=obj.tableName;
				if(rs.rows.length>0){//有了
					oData.setData={};
					oData.where={};
					oData.where=This.extend(oData.where,obj.where);;
					oData.setData=This.extend(oData.setData,obj.addData);
					oData.type="update";
				}else{//没有
					oData.data={};
					oData.data=This.extend(obj.where,obj.addData);
					oData.type="insert";
				}
				//console.log(rs.rows);
				oData.success=function (rs){
					//console.log(rs.rows);
					obj.success && obj.success(rs);
				}
				//console.log(oData);
				This.operate(oData);
			};
			//console.log(oJson);
			This.operate(oJson);
			break;

			case "delete":
			oWhere=This.keyAnd(obj.where);
			tx.executeSql('delete from '+sTableName+' where '+oWhere.key,oWhere.val,function(tx,rs){
	           		success && success(rs,tx);
	        },function (){
	        		error && error();
	        });
			break;

			case "del":
			tx.executeSql('delete from '+sTableName,[],function(tx,rs){
	           		success && success(rs,tx);
	        },function (){
	        		error && error();
	        });
			break;

			case "drop":
			tx.executeSql('drop table '+sTableName,[],function(tx,rs){
	           		success && success(rs,tx);
	        },function (){
	        		error && error();
	        });
			break;
		}
	});
};
Webdb.prototype.keyAnd=function (obj){
	var sWhereKey='';
	var sWhereVal=[];
	for(var o in obj){
		sWhereKey+=o+'=\? ';
		sWhereVal.push(''+obj[o]);
	}
	sWhereKey=sWhereKey.replace(/\? /mg,'\? and ').replace(/\? and $/mg,'\?');
	return {
		key:sWhereKey,
		val:sWhereVal
	};
};
//数据合并
Webdb.prototype.extend=function (o1, o2, preventOverwrite){//第三个参数，不覆盖o1的数值
	for (var prop in o2) {
        if (o2.hasOwnProperty(prop)) {
            if(preventOverwrite && o1.hasOwnProperty(prop)) {
                continue;
            }
            o1[prop] = o2[prop];
        }
    }
    return o1;
};