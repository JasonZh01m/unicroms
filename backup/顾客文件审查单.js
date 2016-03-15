/**
*  顾客文件审查单
*  2016.01.20
*/

//ajax service
document.write('<script type="text/javascript" src="../../js/ds_j.js"></script>');
document.write('<script type="text/javascript" src="../../js/common_util.js" ></script>');
document.write('<script type="text/javascript" src="../../dwrDefault/engine.js"></script>');
document.write('<script type="text/javascript" src="../../dwrDefault/util.js"></script>');
document.write('<script type="text/javascript" src="../../dwrDefault/interface/ajax_OrgAccessor.js"></script>');
document.write('<script type="text/javascript" src="../../dwrDefault/interface/ajax_ExtOrgAccessor.js"></script>');
document.write('<script type="text/javascript" src="../../dwrDefault/interface/ajax_DatabaseAccessor.js"></script>');
document.write('<script type="text/javascript" src="../../dwrDefault/interface/ajax_IsoModuleAccessor.js"></script>');
document.write('<script type="text/javascript" src="../../CustomJsLib/prefixAction/formComponentAction.js"></script>');
document.write('<script type="text/javascript" src="../../CustomJsLib/prefixDocument/formPrefixDocument.js"></script>');
document.write('<script type="text/javascript" src="../../CustomJsLib/EFGPShareMethod.js"></script>'); //表單JS開窗
document.write('<script type="text/javascript" src="/zWARforUnimicron/dwrCustom/interface/ajax_get2ndCategoryOID.js"></script>');
//創建數据源
var databaseCfgId_EFGP = "NaNaISO";
var databaseCfgId_EF2K = "easyflow70";
var databaseCfgId_EFGPDB = "EFGPDB";
var tEFGPConn = new DataSource(formId, "EFGP"); //代表資料由BPM資料庫取得
var tNaNaConn = new DataSource(formId,"NaNaISO");
var tFormPrefixDocument = getResumptionFormPrefix();    
var tNaNaDBConn = new DataSource(formId,"EFGPDB");

var gHdnTopManager = document.getElementById("hdnTopManager");
var gDdlPrice = document.getElementById("ddlPrice");
var gHdnPrice = document.getElementById("hdnPrice");
var gRdoQuotaType = document.getElementById("rdoQuotaType");//编制类别
var gRdoQuotaType_0 = document.getElementById("rdoQuotaType_0");//编制类别-->正式
var gRdoQuotaType_1 = document.getElementById("rdoQuotaType_1");//编制类别-->非正式
var gTxtApplyDate = document.getElementById("txtApplyDate");//申请日期txt
var gHdnAuthorName = document.getElementById("hdnAuthorName");//申请人姓名隐藏
var gInputLabel_Author_lbl = document.getElementById("InputLabel_Author_lbl");//申请人姓名
var gInputLabel_Author_txt = document.getElementById("InputLabel_Author_txt");//申请人ID

var gTxtExtPhone = document.getElementById("txtExtPhone");//分机
var gTxtServiceNo = document.getElementById("txtServiceNo");//客服人员编号
var gTxtServiceName = document.getElementById("txtServiceName");//客服人员姓名
var gBtnService = document.getElementById("btnService");//客服人员开窗
var gTxtCustCode = document.getElementById("txtCustCode");//顾客代码
var gTextbox_DocName = document.getElementById("Textbox_DocName");//文件名称
var gTextbox_DocNo = document.getElementById("Textbox_DocNo");//文件编号
var gButton_PreGetNo = document.getElementById("Button_PreGetNo");//预取编号按钮
var gRdoVerType = document.getElementById("rdoVerType");//版本类别
var gRdoVerType_0 = document.getElementById("rdoVerType_0");//版本类别-->新增
var gRdoVerType_1 = document.getElementById("rdoVerType_1");//版本类别-->变更
var gRdoVerType_2 = document.getElementById("rdoVerType_2");//版本类别-->作废
var gDate_EffectDate = document.getElementById("Date_EffectDate");//生效日期
var gRdoIsVersionAutoGen = document.getElementById("rdoIsVersionAutoGen");//文件版号
var gRdoIsVersionAutoGen_0 = document.getElementById("rdoIsVersionAutoGen_0");//文件版号-->系统自动生成
var gRdoIsVersionAutoGen_1 = document.getElementById("rdoIsVersionAutoGen_1");//文件版号-->自行输入
var gTextbox_CustomVersion = document.getElementById("Textbox_CustomVersion");//手动输入文件版号
var gDropdown_KeepingUnits = document.getElementById("Dropdown_KeepingUnits");//保管单位drop
var gTextbox_KeepingUnitNo = document.getElementById("Textbox_KeepingUnitNo");//保管单位代号
var gButton_KeepingUnit = document.getElementById("Button_KeepingUnit");//保管单位开窗
var gTextbox_KeepingUnitName = document.getElementById("Textbox_KeepingUnitName");//保管单位名称
var gHdnTextbox_KeepingUnit = document.getElementById("HdnTextbox_KeepingUnit");//保管单位隐藏栏位
var gDropdown_PowerLevel = document.getElementById("Dropdown_PowerLevel");//机密等级下拉框
var gHdn_PowerLevel = document.getElementById("Hdn_PowerLevel");//机密等级隐藏栏位
var gTxaDocDesc = document.getElementById("txaDocDesc");//描述备注
var gRdoImportant = document.getElementById("rdoImportant");//会签时效
var gRdoImportant_0 = document.getElementById("rdoImportant_0");//会签时效-->一天
var gRdoImportant_1 = document.getElementById("rdoImportant_1");//会签时效-->三天
var gDropdown_RelatedUnits = document.getElementById("Dropdown_RelatedUnits");//会签單位



var gHdnSaveDate = document.getElementById("hdnSaveDate");//填單人Requester關卡於formSave時程式自動取得當下系統日期+時間寫入欄位值
var gHdnLimitDate = document.getElementById("hdnLimitDate");//datetime 限定日期
var gTextbox_FrameUnitNo = document.getElementById("Textbox_FrameUnitNo");//來自文件類別，取得對應DCC群組後寫入
var gTextbox_FrameUnitName = document.getElementById("Textbox_FrameUnitName");//來自文件類別，取得對應DCC群組後寫入
var gHdnTextbox_FrameUnit = document.getElementById("HdnTextbox_FrameUnit");//來自文件類別，取得對應DCC群組後寫入
var gDate_SetDate = document.getElementById("Date_SetDate");//帶入Requester填單之系統日期-->隐藏栏位
var gHdnTextbox_RelatedDep = document.getElementById("HdnTextbox_RelatedDep");//
var gDdlRUFactory = document.getElementById("ddlRUFactory");//厂别
var gHdnRUFactory = document.getElementById("hdnRUFactory");//厂别代号隐藏栏位
var gHdnRUFactoryName = document.getElementById("hdnRUFactoryName");//厂别名称隐藏栏位
var gButton_RelatedUnit = document.getElementById("Button_RelatedUnit");//部门多選開窗
var gTextbox_RelatedUnitNo = document.getElementById("Textbox_RelatedUnitNo");//部门多選開窗ID
var gTextbox_RelatedUnitName = document.getElementById("Textbox_RelatedUnitName");//部门多選開窗名称
var gGrid_RelateUnit = document.getElementById("Grid_RelateUnit");//会签单位grid
var gTxaRelatedUnitReason = document.getElementById("txaRelatedUnitReason");//DCC签核意见
var gRdoServiceIsAgree = document.getElementById("rdoServiceIsAgree");//客服意见
var gRdoServiceIsAgree_0 = document.getElementById("rdoServiceIsAgree_0");//客服意见 接受
var gRdoServiceIsAgree_1 = document.getElementById("rdoServiceIsAgree_1");//客服意见 部分接受
var gRdoServiceIsAgree_2 = document.getElementById("rdoServiceIsAgree_2");//客服意见 不接受
var gHdnRelatedUnitIsAgree = document.getElementById("hdnServiceIsAgree");//客服意见内储值
var gCheckbox_IsConvertPDF = document.getElementById("Checkbox_IsConvertPDF");//是否轉檔
var gCheckbox_IsConvertPDF_0 = document.getElementById("Checkbox_IsConvertPDF_0");//是否轉檔 是
var gCheckbox_IsConvertPDF_1 = document.getElementById("Checkbox_IsConvertPDF_1");//是否轉檔 否
var gPDFFileSecurity = document.getElementById("PDFFileSecurity");//安全性
var gPDFFileSecurity_0 = document.getElementById("PDFFileSecurity_0");//安全性 高
var gPDFFileSecurity_1 = document.getElementById("PDFFileSecurity_1");//安全性 中
var gPDFFileSecurity_2 = document.getElementById("PDFFileSecurity_2");//安全性 低

var gGrid_DocServer = document.getElementById("Grid_DocServer");//DOCServer
var gBtnECNNo = document.getElementById("btnECNNo");//
var gButton_DelUnit = document.getElementById("Button_DelUnit");//
var gButton_EditUnit = document.getElementById("Button_EditUnit");//
var gButton_EditLeadUnit = document.getElementById("Button_EditLeadUnit");//
var gButton_DelLeadUnit = document.getElementById("Button_DelLeadUnit");//


var gTxtECNNo = document.getElementById("txtECNNo");//
var gBtnPCB_SBU = document.getElementById("btnPCB_SBU");//
var gBtnCAR_SBU = document.getElementById("btnCAR_SBU");//
var gRdoIsNeed = document.getElementById("rdoIsNeed");//
var gRdoIsNeed_0 = document.getElementById("rdoIsNeed_0");//
var gRdoIsNeed_1 = document.getElementById("rdoIsNeed_1");//
var gTxaUnNessResason = document.getElementById("txaUnNessResason");//
var gHdnIsNeed = document.getElementById("hdnIsNeed");//
var gDropdown_ECNUnit = document.getElementById("Dropdown_ECNUnit");//
var gDdlECNFactory = document.getElementById("ddlECNFactory");//
var gBtnECNDept = document.getElementById("btnECNDept");//
var gTxtECNDeptId = document.getElementById("txtECNDeptId");//
var gTxtECNDeptName = document.getElementById("txtECNDeptName");//
var gHdnECNUnitManager = document.getElementById("hdnECNUnitManager");//
var gHdnGridECNNoIsNull = document.getElementById("hdnGridECNNoIsNull");//
var gHdnECNFactory = document.getElementById("hdnECNFactory");//
var gHdnECNFactoryName = document.getElementById("hdnECNFactoryName");//
var gHdnECNOwners = document.getElementById("hdnECNOwners");//
var gHdnUnitManagerAppr = document.getElementById("hdnUnitManagerAppr");//
var gButton_ModECNAdd = document.getElementById("Button_ModECNAdd");//
var gButton_ModECNEdit = document.getElementById("Button_ModECNEdit");//
var gButton_ModECNDel = document.getElementById("Button_ModECNDel");//
var gGrid_ECNModRecord = document.getElementById("Grid_ECNModRecord");//
var gTxtCustDocOwner = document.getElementById("txtCustDocOwner");//
var gTxtCustDocOwnerName = document.getElementById("txtCustDocOwnerName");//
var gHdnCustDocOwnerOID = document.getElementById("hdnCustDocOwnerOID");//

var gHdnProcessInstOID1 = document.getElementById("hdnProcessInstOID");//

var gRdoModDocIsNeed = document.getElementById("rdoModDocIsNeed");//
var gRdoModDocIsNeed_0 = document.getElementById("rdoModDocIsNeed_0");//
var gRdoModDocIsNeed_1 = document.getElementById("rdoModDocIsNeed_1");//
var gTxaDocUnNessResason = document.getElementById("txaDocUnNessResason");//
var gHdnModDocIsNeed = document.getElementById("hdnModDocIsNeed");//
var gTxtModDocNo = document.getElementById("txtModDocNo");//
var tBtnModDocNo = document.getElementById("btnModDocNo");//

var gGrid_ModDoc = document.getElementById("Grid_ModDoc");//

var gSerialNumber = document.getElementById("SerialNumber");//表單單號

//取得使用者上級單位
function getManager(){
	if(gInputLabel_Author_txt.value !=""){
			var tsql = "  select Users2.id, Users2.userName from Functions, Users, OrganizationUnit Unit, OrganizationUnit Unit2, Users Users2 "+
					   " where Functions.occupantOID = Users.OID and Functions.organizationUnitOID = Unit.OID "+
					   " and Unit.superUnitOID = Unit2.OID and Unit2.managerOID = Users2.OID "+
					   " and Users.id = '"+gInputLabel_Author_txt.value+"' ";
			var rs=tNaNaConn.query(tsql);
			if(rs.length>0){ 
				gHdnTopManager.value = rs[0][0];
			}			
		}
}







//获取显示/隐藏模块内 id   
function getResumptionFormPrefix(){
var tArray=[];
/*********區塊移動元件名稱-字串組合*********/
var tContactInformationStr1="Label3,Label_DocCategory,Button_DocCategory,grid:Grid_DocCategory,Label_defaultCategory,Dropdown_defaultCategory,grid:Grid_ReferDoc,Button_ChooseReferDoc,Btn_DelReferDoc,Label_ISOType,"+
"Button_ISOTypeAdd,grid:Grid_ISOType,lblClause1,grid:Grid_ISOClause,Label_IssueRole,Textbox_RoleName,Btn_IssueRole,Label_IssueUnit,Dropdown_IssueUnits,Textbox_IssueUnitNo,Btn_IssueUnit,"+
"Textbox_IssueUnitName,grid:Grid_IssueUnit,XC016,Button_IssueUnitDel,grid:Grid_UpperDoc,Button_ChooseUpperDoc,Btn_DelUpperDoc,Label100,ddlVettingUnitType,txtVettingUnitID,txtVettingUnitName,btnVettingUnit,"+
"Label97,txtPeriod,Label101,Label95,txtVettingNoticeDay,Label104";

	tArray[0] = "Block_A" + "," + tContactInformationStr1;
    tArray[0] = tArray[0].split(",");
return tArray;      
}

function formCreate(){
	var tsql = " select OID,id,docServerAddress from DocServer ";
	var rs = tNaNaConn.query(tsql);
	var phaseArray=new Array();
	if(rs.length>0){
		for(var i=0;i<rs.length;i++){
				phaseArray[i]=new Array();
				phaseArray[i][0]=rs[i][0];
				phaseArray[i][1]=rs[i][1];
				phaseArray[i][2]=rs[i][2];
			}
		Grid_DocServerObj.reload(phaseArray);
		document.getElementById("Grid_DocServer").value=Grid_DocServerObj.toArrayString();
	}
	var tGridId = Grid_DocServerObj.getId();    
	var tGridElement_DocServer = document.getElementById(tGridId);   
	tGridElement_DocServer.style.display="none";   //隱藏
	document.getElementById("Btn_DocServerAdd").style.display="none";//隱藏
	hideColumnByPrefix(tFormPrefixDocument,"Block_A");
	document.getElementById("Attachment").disabled = false;
	gDate_setDate.value = systemDateTime;
	
	return true;
}
function formOpen(){
	//為手持裝置新增的按鈕 , 只於手持裝置上操作時會出現  SINCE NANA5.5.2 MODI BY 4182 IN 20121220	
	var tOS = navigator.userAgent.toLowerCase();	
	if(tOS.indexOf('iphone') > 0 || tOS.indexOf('ipad') > 0  || tOS.indexOf('ios') > 0 ){
	//do nothing
	}else{
		if(document.getElementById("btnISOClauseOpen"))	document.getElementById("btnISOClauseOpen").style.display = "none";
		if(document.getElementById("btnRefOpen"))	document.getElementById("btnRefOpen").style.display = "none";
		if(document.getElementById("btnUpperDocOpen"))	document.getElementById("btnUpperDocOpen").style.display = "none";
		if(document.getElementById("btnIssueUnitOpen"))	document.getElementById("btnIssueUnitOpen").style.display = "none";
		if(document.getElementById("btnRelateUnitOpen"))	document.getElementById("btnRelateUnitOpen").style.display = "none";
		if(document.getElementById("btnPowerOpen"))	document.getElementById("btnPowerOpen").style.display = "none";
	}	
	
	gInputLabel_Author_lbl.value = userName;
	document.getElementById("hdnAuthorName").value = userName;
	gInputLabel_Author_txt.value = userId;
	gTxtApplyDate.value = systemDateTime;
	gBtnPCB_SBU.style.display="none";//隱藏
	gBtnCAR_SBU.style.display="none";//隱藏
	gBtnService.disabled = true;//唯讀
	gRdoModDocIsNeed.disabled = true;//唯讀
	gTxtModDocNo.disabled = true;//唯讀
	if(activityId=="ISODocManagerConfirm"){
		gDate_EffectDate.disabled = false;
		gRdoModDocIsNeed.disabled = false;
		gTxtModDocNo.disabled = false;
	}else{
		gDate_EffectDate.disabled=true;
	}
	if(activityId=="RelateUnits"||activityId=="ECNUnitManager"){
		gBtnECNNo.disabled=false;
		gBtnPCB_SBU.disabled=false;
		gBtnCAR_SBU.disabled=false;
		//gRdoIsNeed.disabled=false;
		gTxaUnNessResason.disabled=false;
		gDropdown_ECNUnit.disabled=false;
		gDdlECNFactory.disabled=false;
		gButton_ModECNEdit.disabled=false;
	}
	if(activityId=="RelateUnits"){
		gTxtCustDocOwner.value = userId;
		gTxtCustDocOwnerName = userName;
		gHdnCustDocOwnerOID = userOID;
		gButton_ModECNAdd.disabled=false;
		gButton_ModECNDel.disabled=false;
		gRdoModDocIsNeed.disabled = false;
		gTxtModDocNo.disabled = false;
		
	}
	if(activityId == "ISODocManager" || activityId == "DCC_Check"){
		gRdoModDocIsNeed.disabled = false;
		gTxtModDocNo.disabled = false;
	}
	
	gRdoIsVersionAutoGen.disabled=true;

	
	
	
	gDdlRUFactory.disabled=false;
	gBtnECNNo.disabled=false;
	gBtnPCB_SBU.disabled=false;
	gBtnCAR_SBU.disabled=false;
	//gRdoIsNeed.disabled=false;
	gTxaUnNessResason.disabled=false;
	gDropdown_ECNUnit.disabled=false;
	gDdlECNFactory.disabled=false;
	gButton_ModECNEdit.disabled=false;
	
	gButton_DelUnit.disabled=false;
	gButton_EditUnit.disabled=false;
	gButton_EditLeadUnit.disabled=false;
	gButton_DelLeadUnit.disabled=false;
	
	
	

	
	
		
	getRUFactory();
	//撈取單位主管
	getManager();
return true;
}

//少於2位數補零
function checkTime(i) 
{ 
	if (i<10) { i="0" + i } return i 
}


function formSave(){
	if(!formCheck()){
	
		return false;
	}
	
	if(workItemSource==0){
		//gDate_setDate.value = systemDateTime;
		gTxtApplyDate.value = systemDateTime;
		
	}
	
	if(activityId=="Requester"){
		var  time= new Date();	
		//ex.2016/01/11 10:58:55
		gHdnSaveDate.value=systemDateTime+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
		//alert("gHdnSaveDate="+gHdnSaveDate.value);
	}
	
	
	
	if(activityId=="ISODocManagerConfirm"){
		gDate_EffectDate.value = systemDateTime;
		
		var grdECN = Grid_ECNModRecordObj.getData();
		var userNo = "";
		for(var i=0;i<grdECN.length;i++){
			userNo+=grdECN[i][1]+";";
		}
		if(userNo==""){
			alert("申請人爲空！");
			return false;
		}else{
			gHdnECNOwners.value = userNo;
		}
	}
	
	if(activityId=="RelateUnits"){
		var grdECN = Grid_ECNModRecordObj.getData();
		var flag = "";
		var unitManager = "";
		for(var i=0;i<grdECN.length;i++){
			if(grdECN[i][3]==""){
				flag="Y";
			}
			unitManager += grdECN[i][10]+";";
		}
		gHdnGridECNNoIsNull.value = flag;
		if(unitManager==""){
			alert("部門主管爲空！");
			return false;
		}else{
			gHdnUnitManagerAppr.value = unitManager;
		}
		
	}
	
	//取得填單人之工作日期
	var workDays = "";
	if(gRdoImportant_0.checked==true){
		workDays = 1;
	}else if(gRdoImportant_1.checked==true){
		workDays = 3;
	}
	
	alert("userOID="+userOID+" ,gHdnSaveDate="+gHdnSaveDate.value+" ,workDays="+workDays);
	ajax_OrgAccessor.fetchWorkDate(userOID,gHdnSaveDate.value,workDays,function(data){
		gHdnLimitDate = data;
		alert(data);
	});
	
	document.getElementById("TextArea_ModDocModreason").value = "此文件變更單係由顧客文件審查單自動發起，單號：["+gSerialNumber.value+"]";
	
return true;
}
function formClose(){
return true;
}

function formCheck(){
	var msg = "";
		
	var grdDocServer = Grid_DocServerObj.getData();
	if(grdDocServer.length<0){
		msg+="無DocServer的記錄!!\n";
	}
	
	if(gDdlPrice.value==""||gDdlPrice.value=="$$$$$$"){
		msg+="請選擇事業別!!\n";
	}
	if(gRdoQuotaType_0.checked==false&&gRdoQuotaType_1.checked==false){
		msg+="請選擇編制類別!!\n";
	}
	if(gTxtServiceNo.value==""||gTxtServiceName.value==""){
		msg+="請選擇客服人員!!\n";
	}
	if(gTxtCustCode.value==""){
		msg+="顧客代碼不能爲空!!\n";
	}
	if(gTextbox_DocName.value==""){
		msg+="文件名稱不能爲空!!\n";
	}
	if(gTextbox_DocNo.value==""){
		msg+="文件編號不能爲空!!\n";
	}
	if(gRdoVerType_0.checked==false&&gRdoVerType_1.checked==false&&gRdoVerType_2.checked==false){
		msg+="請選擇版本類別!!\n";
	}
	if(gTextbox_CustomVersion.value==""){
		msg+="文件版號不能爲空!!\n";
	}
	if(gDropdown_KeepingUnits.value==""||gTextbox_KeepingUnitNo.value==""){
		msg+="請選擇保管單位!!\n";
	}
	if(gTxaDocDesc.value==""||gTxaDocDesc.value=="請填寫與舊版的差異"){
		msg+="描述備註不能爲空!!\n";
	}
	if(gRdoImportant_0.checked==false&&gRdoImportant_1.checked==false){
		msg+="請選擇會簽時效!!\n";
	}
	var grdRelateUnit = Grid_RelateUnitObj.getData();
	if(grdRelateUnit.length<=0){
		msg+="請選擇會簽單位!!\n";
	}
	if(activityId=="Service"){
		if(gRdoServiceIsAgree_0.checked==false&&gRdoServiceIsAgree_1.checked==false&&gRdoServiceIsAgree_2.checked==false){
			msg+="請選擇客服意見匯整是否接受!!\n";
		}
	}
	if(gHdnRelatedUnitIsAgree.value=="X"||gHdnRelatedUnitIsAgree.value=="N"){
		var txaServiceReply = trim(gTxaServiceReply.value);
		if(txaServiceReply.value==""){
			msg+="客服意見匯整不能爲空!!\n";
		}
	}
	if(gCheckbox_IsConvertPDF_0.checked==false&&gCheckbox_IsConvertPDF_1.checked==false){
		msg+="請選擇是否轉檔!!\n";
	}else if(gCheckbox_IsConvertPDF_1.checked==false&&gPDFFileSecurity_0.checked==false&&gPDFFileSecurity_1.checked==false&&gPDFFileSecurity_2.checked==false){
		msg+="請選擇文件轉檔後之安全性!!\n";
	}
	
	if(msg!=""){
		alert(msg);
		return false;
	}else{
		return true;
	}
}

function Button_ModECNDel_onclick(){
	Grid_ECNModRecordObj.deleteRow();
	gGrid_ECNModRecord.value =Grid_ECNModRecordObj.toArrayString();
	Grid_ECNModRecordObj.clearBinding();
}

function Button_ModECNEdit_onclick(){
	var msg="";
	if(activityId=="RelateUnits"||activityId=="ECNUnitManager"){
		if(gTxtCustDocOwner.value ==""||gTxtCustDocOwnerName.value ==""){
			msg+="申請人不能爲空!!\n";
		}
		if(gTxtECNNo.value!=""){
			if(gRdoIsNeed_0.checked==false&&gRdoIsNeed_1.checked==false){
				msg+="請選擇是否需要變更!!\n";
			}
			if(gRdoIsNeed_1.checked==true){
				if(gTxaUnNessResason.value==""){
					msg+="請填寫不需要變更原因!!\n";
				}
			}
		}else{
			if(gDropdown_ECNUnit.value==""){
				msg+="請選擇部門類型!!\n";
			}
			if(gDdlECNFactory.value==""){
				msg+="請選擇厰別!!\n";
			}
			if(gTxtECNDeptId.value==""||gTxtECNDeptName.value==""){
				msg+="請選擇部門!!\n";
			}
		}
		if(activityId=="ECNUnitManager"){
			if(gTxtECNNo.value==""){
				msg+="ECN單號不能爲空!!\n";
			}
			if(gRdoIsNeed_0.checked==false&&gRdoIsNeed_1.checked==false){
				msg+="請選擇是否需要變更!!\n";
			}
			if(gRdoIsNeed_1.checked==true){
				if(gTxaUnNessResason.value==""){
					msg+="請填寫不需要變更原因!!\n";
				}
			}
		}
	}
	if(msg!=""){
		alert(msg);
		return false;
	}else{
		Grid_ECNModRecordObj.editRow();
		gGrid_ECNModRecord.value =Grid_ECNModRecordObj.toArrayString();
		Grid_ECNModRecordObj.clearBinding();
	}
}

function Button_ModECNAdd_onclick(){
	var msg="";
	if(activityId=="RelateUnits"){
		if(gTxtCustDocOwner.value ==""||gTxtCustDocOwnerName.value ==""){
			msg+="申請人不能爲空!!\n";
		}
		if(gTxtECNNo.value!=""){
			if(gRdoIsNeed_0.checked==false&&gRdoIsNeed_1.checked==false){
				msg+="請選擇是否需要變更!!\n";
			}
			if(gRdoIsNeed_1.checked==true){
				if(gTxaUnNessResason.value==""){
					msg+="請填寫不需要變更原因!!\n";
				}
			}
		}else{
			if(gDropdown_ECNUnit.value==""){
				msg+="請選擇部門類型!!\n";
			}
			if(gDdlECNFactory.value==""){
				msg+="請選擇厰別!!\n";
			}
			if(gTxtECNDeptId.value==""||gTxtECNDeptName.value==""){
				msg+="請選擇部門!!\n";
			}
		}
	}
	if(msg!=""){
		alert(msg);
		return false;
	}else{
		Grid_ECNModRecordObj.addRow();
		gGrid_ECNModRecord.value =Grid_ECNModRecordObj.toArrayString();
		Grid_ECNModRecordObj.clearBinding();
	}
}

function btnECNDept_onclick(){
	var tsql = " select CustTB.deptId, CustTB.deptName, Users.id, Users.userName "+
           " from CustFactory_GroupManager CustTB, Users "+
           " where CustTB.referUnitManagerOID = Users.OID "+
           " and CustTB.factoryId = '"+gDdlECNFactory.value+"' ";
		var FileName = "SingleOpenWin";
		var SQLClaused = new Array(tsql);
		var SQLLabel = new Array ("部門代號","部門名稱","部門主管代號","部門主管姓名");
		var QBEField = new Array("CustTB.deptId","CustTB.deptName","Users.id","Users.userName");
		var QBELabel = new Array ("部門代號","部門名稱","部門主管代號","部門主管姓名");
		var RetrunId =new Array("txtECNDeptId","txtECNDeptName","hdnECNUnitManager","hdnNull");
		singleOpenWin(FileName,databaseCfgId_EFGP,SQLClaused,SQLLabel,QBEField,QBELabel,RetrunId,700,430);
		   
}

function txtECNNo_onchange(){
	if(gTxtECNNo.value==""){
		gDropdown_ECNUnit.disabled = false;
		gDdlECNFactory.disabled = false;
		gBtnECNDept.disabled = false;
	}
}

function ddlECNFactory_onchange(){
	gHdnECNFactory.value = gDdlECNFactory.value; //將下拉表單value存入隱藏欄位
	gHdnECNFactoryName.value = gDdlECNFactory.options[gDdlECNFactory.selectedIndex].text; //將下拉表單text存入隱藏欄位
	if(gHdnECNFactory.value!="$$$$$$"){
		gBtnECNDept.disabled=false;
	}else{
		gBtnECNDept.disabled=true;
	}
}

function rdoIsNeed_onclick(){
	if(gRdoIsNeed_1.checked==true){
		alert("警告！\n請詳述不需要之理由，嚴禁僅用'NA'字眼描述！");
		gHdnIsNeed.value = "N";
	}else{
		gHdnIsNeed.value = "Y";
	}
	
}

function btnPCB_SBU_onclick(){
 openDialog("http://workflow/EF2KWeb/CHT/Program/PCB_ECR_Q/PCB_ECR_Q_Query.asp?ProgID=PCB_ECR_Q&ProgInit=Y&terry=Y", "600", "500", "titlebar,scrollbars,status,resizable");
}

function btnCAR_SBU_onclick(){
	if(gTxtECNNo.value ==""){
		alert("請先選擇ECR單號!!");
		return false;
	}else{
		alert("OID:"+gHdnProcessInstOID1.value+"\nuserId:"+userId)
		 openDialog("/NaNaWeb/GP/WMS/TraceProcess/TraceProcessMain?hdnMethod=traceProcessFromExternalWeb&hdnProcessInstOID='"+gHdnProcessInstOID1.value+"'&hdnCurrentUserId='"+userId+"'", "600", "500", "titlebar,scrollbars,status,resizable");
	}

}

//ECN單號選擇
function btnECNNo_onclick(){

	var tsql = "";
	if(gHdnPrice.value=="PCB"){
		tsql = "SELECT pcb_ecn_m002, fill_empl_name, aplydate, CASE resda021 "+
            " WHEN '1' THEN '簽核中' WHEN '2' THEN '同意' END resda021 "+
            " FROM dbo.pcb_ecn_m LEFT JOIN resda ON resda001=pcb_ecn_m001 "+
            " AND resda002=pcb_ecn_m002 WHERE (resda021='1' OR resda021='2') ";
		var FileName = "SingleOpenWin";
		var SQLClaused = new Array(tsql);
		var SQLLabel = new Array ("單號","申請人姓名","申請日期","簽核狀態");
		var QBEField = new Array("pcb_ecn_m002","fill_empl_name","aplydate","resda021");
		var QBELabel = new Array ("單號","申請人姓名","申請日期","簽核狀態");
		var RetrunId =new Array("txtECNNo","hdnNull","hdnNull","hdnNull");
		singleOpenWin(FileName,databaseCfgId_EF2K,SQLClaused,SQLLabel,QBEField,QBELabel,RetrunId,700,430);
		   
	}else if(gHdnPrice.value=="Carrier"){
		tsql = " select Frm03.formSerialNumber, Frm03.aply_name, Frm03.aply_date, "+
           " CASE PI.currentState WHEN '1' THEN '簽核中' WHEN '3' THEN '同意' END currentState "+
           " from frm_03_carecr Frm03, ProcessInstance PI "+
           " where Frm03.processSerialNumber = PI.serialNumber and PI.currentState <= 3 ";
		var FileName = "SingleOpenWin";
		var SQLClaused = new Array(tsql);
		var SQLLabel = new Array ("單號","申請人姓名","申請日期","簽核狀態");
		var QBEField = new Array("Frm03.formSerialNumber","Frm03.aply_name","Frm03.aply_date","PI.currentState");
		var QBELabel = new Array ("單號","申請人姓名","申請日期","簽核狀態");
		var RetrunId =new Array("txtECNNo","hdnNull","hdnNull","hdnNull");
		singleOpenWin(FileName,databaseCfgId_EFGP,SQLClaused,SQLLabel,QBEField,QBELabel,RetrunId,700,430);
	}
	
}

//主導部門新增
function Button_EditLeadUnit_onclick(){
	var grdRelateUnitData = Grid_RelateUnitObj.getData();
	var tIndex = Grid_RelateUnitObj.getSelectionProperty("index");
	var grdLeadUnitData = Grid_LeadUnitObj.toArrayString();
	var tGridDtl = "";
	var tDel = grdLeadUnitData.substring(0,grdLeadUnitData.lastIndexOf("]")); 
	if(grdLeadUnitData!="[]"){
		tDel+=",[";
	}else{
		tDel+="[";
	}
	for(var i=0;i<grdRelateUnitData[tIndex].length;i++){
		tDel += "'"+grdRelateUnitData[tIndex][i]+"',";
	}
	tDel = tDel.substring(0,(tDel.lastIndexOf(","))); 
	tDel+="]]";
	Grid_LeadUnitObj.reload(eval(tDel)); 
	document.getElementById("Grid_LeadUnit").value = Grid_LeadUnitObj.toArrayString();  //將新的資料存入Grid隱藏欄位中
}

//主導部門刪除
function Button_DelLeadUnit_onclick(){
	Grid_LeadUnitObj.deleteRow();
	document.getElementById("Grid_LeadUnit").value = Grid_LeadUnitObj.toArrayString();  //將新的資料存入Grid隱藏欄位中
	//Grid_LeadUnitObj.clearBinding();
}

function updateSelectedDocServers(){
	var tHdnData=document.getElementById("HdnTextbox_DocServer").value;
	if(tHdnData==""){
		tHdnData=[];
	}
	Grid_DocServerObj.reload(eval(tHdnData));		
	document.getElementById("Grid_DocServer").value = Grid_DocServerObj.toArrayString();	
}

//客服意见汇整是否
function rdoServiceIsAgree_onclick(){
	if(gRdoServiceIsAgree_0.checked==true){
		gHdnRelatedUnitIsAgree.value = "Y";
	}
	if(gRdoServiceIsAgree_1.checked==true){
		gHdnRelatedUnitIsAgree.value = "X";
	}
	if(gRdoServiceIsAgree_2.checked==true){
		gHdnRelatedUnitIsAgree.value = "N";
	}
}

//判断DCC签核意见不能为空
function txaRelatedUnitReason_onblur(){
	var reason = trim(gTxaRelatedUnitReason.value);
	if(reason==""||gTxaRelatedUnitReason.value==""){
		alert("簽核意見不允許空白，請重新輸入!!");
		gTxaRelatedUnitReason.value="";
		return false;
	}
}

function btnRelateUnitOpen_onClick(){
	FormdisplayGridCtrl(Grid_RelateUnitObj,document.getElementById("btnRelateUnitOpen"));
}


function Button_EditUnit_onclick(){                      //更新
	if(!(checkFinish("Textbox_RelatedUnitNo","相關單位","",""))){
		return false;
	}
	Grid_RelateUnitObj.editRow();  //將Binding欄位的資料填入Grid中 
	Grid_RelateUnitObj.clearBinding();  //新增後清除Binding欄位資料   
	document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();  //將新的資料存入Grid隱藏欄位中
	
	document.getElementById("Textbox_RelatedUnitNo").value="";
	document.getElementById("Textbox_RelatedUnitName").value="";
	document.getElementById("HdnTextbox_RelatedUnit").value="";
	document.getElementById("HdnTextbox_UnitUsers").value="";
	document.getElementById("Dropdown_RelatedUnits").value ="$$$$$$";
	document.getElementById("ddlRUFactory").value ="$$$$$$";
	
}

function Button_DelUnit_onclick(){                      //刪除
	Grid_RelateUnitObj.deleteRow();
	document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();//將新的資料存入Grid隱藏欄位中
	Grid_RelateUnitObj.clearBinding();
	
	document.getElementById("Textbox_RelatedUnitNo").value="";
	document.getElementById("Textbox_RelatedUnitName").value="";
	document.getElementById("HdnTextbox_RelatedUnit").value="";
	document.getElementById("HdnTextbox_UnitUsers").value="";
	document.getElementById("Dropdown_RelatedUnits").value ="$$$$$$";
	document.getElementById("ddlRUFactory").value ="$$$$$$";
	
}

function Button_AddUnit_onclick(){                    //新增
	if(gTextbox_RelatedUnitNo.value==""||gTextbox_RelatedUnitName.value==""){
		alert("會簽部門不能爲空！！");
		return false;
	}
	Grid_RelateUnitObj.addRow();
	document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();//將新的資料存入Grid隱藏欄位中
	document.getElementById("Textbox_RelatedUnitNo").value="";
	document.getElementById("Textbox_RelatedUnitName").value="";
	document.getElementById("HdnTextbox_RelatedUnit").value="";
	document.getElementById("HdnTextbox_UnitUsers").value="";
	document.getElementById("Dropdown_RelatedUnits").value ="3";
	document.getElementById("ddlRUFactory").value ="$$$$$$";
}

function checkFinish(textId,textname,content,focusId){
  var textVar = document.getElementById(textId).value;
  if( textVar == content){
    alert("請填寫"+textname);
    if(focusId==""){
      document.getElementById(textId).focus();
    }else{
      document.getElementById(focusId).focus();
    }
    return false;
  }
  return true;
}

//开窗按钮执行完毕后，改变其他值
function checkPointOnClose(pReturnId) {
	//当关闭的开窗为相關單位开窗时，多筆欄位格式：name,name,name
	if(pReturnId == "Textbox_RelatedUnitNo"){
		var strUnitNo="";
		var strUnitName="";
		var strGrpId="";
		var strGrpName="";
		var strGrpOID="";
		var selectvalue =  document.getElementById("Textbox_RelatedUnitNo").value;
		if(selectvalue!="" && selectvalue !="[]"){
			selectvalue = eval(selectvalue);
			for(var i = 0 ; i < selectvalue.length; i++){
				strUnitNo += selectvalue[i][1]+";";
				strUnitName += selectvalue[i][2]+";";
				strGrpId += selectvalue[i][3]+";";
				strGrpName += selectvalue[i][4]+";";
				strGrpOID += selectvalue[i][5]+";";
			}
			//document.getElementById("Textbox_RelatedUnitNo").value=strUnitNo.substring(0,strMember.lastIndexOf(","));
			//document.getElementById("Textbox_RelatedUnitName").value=strUnitName.substring(0,strMember.lastIndexOf(","));
			document.getElementById("Textbox_RelatedUnitNo").value=strGrpId;
			document.getElementById("Textbox_RelatedUnitName").value=strGrpName;
			document.getElementById("HdnTextbox_RelatedUnit").value=strGrpOID;
		}
		var tsql = " select Users.id,Users.userName from Users "+
			" join Group_User on Users.OID = Group_User.UserOID "+
			" join Groups on Group_User.GroupOID = Groups.OID "+
			" where GroupOID in(";
		var strGrpOID2 = strGrpOID.substring(0,strGrpOID.length-1);//去除最後一個分號
		var str = strGrpOID2.split(";");
		var strId = "";
		for(var i = 0 ; i < str.length; i++){
				strId += "'" +str[i]+ "',";
			}
		tsql += strId.substring(0,strId.lastIndexOf(","))+") ";
		var rs=tNaNaConn.query(tsql);
		var strUser="";
		if(rs.length>0){  
			for(var i = 0 ; i < rs.length ; i ++)
			strUser+=rs[i][0]+";";
		}
		document.getElementById("HdnTextbox_UnitUsers").value=strUser;
		//新增
		if(gTextbox_RelatedUnitNo.value==""||gTextbox_RelatedUnitName.value==""){
			alert("會簽部門不能爲空！！");
			return false;
		}
		
		
		var grdRelateUnit = Grid_RelateUnitObj.getData();
		if(grdRelateUnit.length >0){
			for(var i=0;i<grdRelateUnit.length;i++){
				if(grdRelateUnit[i][0]==gDdlRUFactory.value){
					alert("此單位已存在！");
						return false;

				}
			}
		}
		Button_AddUnit_onclick();//加入到Grid中
		
	}
	
	if(pReturnId == "txtECNNo"){
		if(gDdlPrice.value =="Carrier"){
			var tsql = " select PI.OID "+
			 " from frm_03_carecr Frm03, ProcessInstance PI "+
             " where Frm03.formSerialNumber = '"+gTxtECNNo.value+"'" +
			 " and Frm03.processSerialNumber = PI.serialNumber and PI.currentState <= 3 ";
			var rs=tNaNaConn.query(tsql);
			if(rs.length>0){ 
				gHdnProcessInstOID1.value = rs[0][0];
				alert(gHdnProcessInstOID1.value);
			}			
		}
	}
}



//客服人員開窗

function btnService_onclick(){
	
	var tsql = "select Users.id, Users.userName from Groups, Group_User, Users "+
			   " where Groups.OID = Group_User.GroupOID "+
			   " and Group_User.UserOID = Users.OID";
		var FileName = "SingleOpenWin";
		var SQLClaused = new Array(tsql);
		var SQLLabel = new Array("客服人員工號","客服人員姓名");
		var QBEField = new Array("id","userName");
		var QBELabel = new Array("客服人員工號","客服人員姓名");
		var RetrunId =new Array("txtServiceNo","txtServiceName");
		singleOpenWin(FileName,databaseCfgId_EFGPDB,SQLClaused,SQLLabel,QBEField,QBELabel,RetrunId,700,430);
		   
}



//設定相關單位
function Button_RelatedUnit_onclick(){ //相關單位的開窗
	if(gDdlRUFactory.value == "$$$$$$"&& gDropdown_RelatedUnits.value=="3"){
		alert("請選擇廠別資料!!");
		return false;
	}
	if(gDropdown_RelatedUnits.value=="3"){
		var FileName = "PluralityOpenWin";
		var tsql = " select CustTB.deptId, CustTB.deptName, Groups.id, Groups.groupName,Groups.OID "+
           " from CustFactory_GroupManager CustTB, Groups "+
           " where CustTB.GroupOID = Groups.OID  " +
		   " and CustTB.factoryId = '"+gHdnRUFactory.value+"'";
		var SQLClaused = new Array(tsql);
		var SQLLabel = new Array ("部門代號","部門名稱","對應群組代號","對應群組名稱");
		var QBEField = new Array("CustTB.deptId","CustTB.deptName","Groups.id","Groups.groupName");
		var QBELabel = new Array ("部門代號","部門名稱","對應群組代號","對應群組名稱");
		var OriginallyData =new Array("Textbox_RelatedUnitNo");
		pluralityOpenWin(FileName, databaseCfgId_EFGP, SQLClaused, SQLLabel, QBEField, QBELabel, OriginallyData, 720, 430);
	}else{
		openDataChooser("User", "single", null, "memberList", "changeUser()");
	}
}

function changeUser(){
	var tNewValue = "";
	var tName = "";
	var tHiddenValue = "";
  
	var vInputLabel=null;
	vInputLabel=memberList;
	if (vInputLabel != null) {
		/*if (typeof(vInputLabel.OrgId) != "undefined") {
			if (vInputLabel.OrgId != null && vInputLabel.OrgId != "") {
				tNewValue = tNewValue + "[" + vInputLabel.OrgId + "]";
			}
		}*/
		if (typeof(vInputLabel.Id) != "undefined") {
			if (vInputLabel.Id != null && vInputLabel.Id != "") {
				tNewValue = tNewValue + vInputLabel.Id ;
			}
		}
		tName = vInputLabel.Name;
    
		if (typeof(vInputLabel.OID) != "undefined") {
      if (vInputLabel.OID != null && vInputLabel.OID != "") {
				tHiddenValue = vInputLabel.OID;
			}
		}     
	}
	document.getElementById("hdnRUFactory").value = "";
	document.getElementById("hdnRUFactoryName").value = tNewValue;
	document.getElementById("Textbox_RelatedUnitNo").value = tNewValue;
	document.getElementById("Textbox_RelatedUnitName").value = tName;
	document.getElementById("HdnTextbox_RelatedUnit").value = tHiddenValue;
	//document.getElementById("Dropdown_RelatedUnits").value = "4";
	Button_AddUnit_onclick();
  
}

function Dropdown_RelatedUnits_onchange(){
	if(document.getElementById("Dropdown_RelatedUnits").value == "4"){
		document.getElementById("ddlRUFactory").disabled = true;
	}else{
		document.getElementById("ddlRUFactory").disabled = false;
	}
	document.getElementById("ddlRUFactory").value = "$$$$$$";
	document.getElementById("Textbox_RelatedUnitNo").value = "";
	document.getElementById("Textbox_RelatedUnitName").value = "";
	
}


//初始化厂别
function getRUFactory(){
	var tSql = " select factoryId, factoryName from CustFactoryDef where isValid = 1 ";
	var results = tNaNaConn.query(tSql);
	var drop_str = "'$$$$$$'" + ":" + "'---請選擇---',";
	for (i=0; i<results.length; i++){  
		drop_str = drop_str + "'" + results[i][0] + "'" + ":" + "'" + results[i][1] + "',";
	} 
	var drop_count = drop_str.lastIndexOf(","); //去掉逗號
	var arraydrop_value = drop_str.substring(0, drop_count);  
	arraydrop_value  = objectEval("{"+arraydrop_value +"}");
	DWRUtil.removeAllOptions(gDdlRUFactory);
	DWRUtil.addOptions(gDdlRUFactory, arraydrop_value); 
	DWRUtil.removeAllOptions(gDdlECNFactory);
	DWRUtil.addOptions(gDdlECNFactory, arraydrop_value); 
	 //把選到的值存到隱藏欄位，之後的關卡才能在下拉選單顯示
	if (gHdnRUFactory.value != "") {
		gDdlRUFactory.value=gHdnRUFactory.value;
		gHdnRUFactoryName.value =  gDdlRUFactory.options[gDdlRUFactory.selectedIndex].text; //將下拉表單text存入隱藏欄位
	}else{
		gHdnRUFactory.value = gDdlRUFactory.value; //將下拉表單value存入隱藏欄位
		gHdnRUFactoryName.value = gDdlRUFactory.options[gDdlRUFactory.selectedIndex].text; //將下拉表單text存入隱藏欄位
	}
	if(gHdnECNFactory.value!=""){
		gDdlECNFactory.value=gHdnECNFactory.value;
		gHdnECNFactoryName.value =  gDdlECNFactory.options[gDdlECNFactory.selectedIndex].text; //將下拉表單text存入隱藏欄位
	}else{
		gHdnECNFactory.value = gDdlECNFactory.value; //將下拉表單value存入隱藏欄位
		gHdnECNFactoryName.value = gDdlECNFactory.options[gDdlECNFactory.selectedIndex].text; //將下拉表單text存入隱藏欄位
	}
}
//选择厂别
function ddlRUFactory_onchange(){
       gHdnRUFactoryName.value =  gDdlRUFactory.options[gDdlRUFactory.selectedIndex].text; //將下拉表單text存入隱藏欄位
	   gHdnRUFactory.value =  gDdlRUFactory.value; //將下拉表單value存入隱藏欄位
	   if(gDdlRUFactory.value!="$$$$$$"){
		   gButton_RelatedUnit.disabled = false;
	   }else{
		   gButton_RelatedUnit.disabled = true;
	   }
}

/*
 * 將字串轉成物件
 */
function objectEval(text){
    text = text.replace(/\n/g, " ");
    text = text.replace(/\r/g, " ");
    if (text.match(/^\s*\{.*\}\s*$/)){
        text = "[" + text + "][0]"; 
    }   
    return eval(text);
}

//描述备注获取焦点事件
function txaDocDesc_onfocus(){
	if(gTxaDocDesc.value =="請填寫與舊版的差異"){
		gTxaDocDesc.value = "";
	}
}

//预取编号按钮点击事件
function Button_PreGetNo_onclick(){
	//將Link由../../../GP/WMS/ 改為 /NaNaWeb/GP/WMS/ SINCE : NANA5.5.2 MODI BY 4182 IN 20121220
 openDialog("/NaNaWeb/GP/WMS/ManageDocument/CreateDocument?hdnMethod=chooseDocDraft&returnField=Textbox_DocNo", "400", "300", "titlebar,scrollbars,status,resizable");
}

//会签單位的開窗
var memberList= new Array;
function Button_FrameUnit_onclick(){
	chooseInputLabel_Unit("Dropdown_FrameUnits");
}



//保管單位的開窗
function Button_KeepingUnit_onclick(){

	chooseInputLabel_Unit("Dropdown_KeepingUnits");

	}

//單選開窗
function chooseInputLabel_Unit(unitfor) {
	var unitforValue=document.getElementById(unitfor).value;
	if(unitforValue==1){ 
		openDataChooser("Department", "single", "null", "memberList", "addInputLabel_Unit("+"'"+unitfor+"'"+")");
	}else if(unitforValue==2){
		openDataChooser("Project", "single", "null", "memberList", "addInputLabel_Unit("+"'"+unitfor+"'"+")");
	}else if(unitforValue==3){
		openDataChooser("Group", "single", "null", "memberList", "addInputLabel_Unit("+"'"+unitfor+"'"+")");
	}
}

//多選開窗
function chooseInputLabels_Unit(unitfor) {
	var unitforValue=document.getElementById(unitfor).value;
  
	if(unitforValue==1){ 
		openDataChooser("Department", "multiple", "null", "memberList", "addInputLabel_Unit("+"'"+unitfor+"'"+")");
	}else if(unitforValue==2){
		openDataChooser("Project", "multiple", "null", "memberList", "addInputLabel_Unit("+"'"+unitfor+"'"+")");
	}else if(unitforValue==3){
		openDataChooser("Group", "multiple", "null", "memberList", "addInputLabel_Unit("+"'"+unitfor+"'"+")");
	}else{
    openDataChooser("Role", "single", null, "memberList", "addInputLabel_Unit("+"'"+unitfor+"'"+")");
	}
}

//事業別選擇
function ddlPrice_onchange(){
	gTxtECNNo.value = "";
	gHdnProcessInstOID = "";
	gHdnPrice.value = gDdlPrice.value;
	if(gDdlPrice.value=="PCB"){
		gBtnPCB_SBU.style.display="block";//顯示
		gBtnCAR_SBU.style.display="none";//隱藏
	}else if(gDdlPrice.value=="Carrier"){
		gBtnPCB_SBU.style.display="none";//隱藏
		gBtnCAR_SBU.style.display="block";//顯示
	}else{
		gBtnPCB_SBU.style.display="none";//隱藏
		gBtnCAR_SBU.style.display="none";//隱藏
	}
}


function addInputLabel_Unit(unitfor) {

	var tNewValue = "";
	var tName = "";
	var tHiddenValue = "";
  
	var vInputLabel=null;
	var unitforValue=document.getElementById(unitfor).value;
	vInputLabel=memberList;
	
	if (vInputLabel != null) {
		if (typeof(vInputLabel.OrgId) != "undefined") {
			if (vInputLabel.OrgId != null && vInputLabel.OrgId != "") {
				tNewValue = tNewValue + "[" + vInputLabel.OrgId + "]";
			}
		}
		if (typeof(vInputLabel.Id) != "undefined") {
			if (vInputLabel.Id != null && vInputLabel.Id != "") {
				tNewValue = tNewValue + vInputLabel.Id ;
			}
		}
		tName = vInputLabel.Name;
    
		if (typeof(vInputLabel.OID) != "undefined") {
      if (vInputLabel.OID != null && vInputLabel.OID != "") {
				tHiddenValue = vInputLabel.OID;
			}
		}     
  }
  
  if(unitfor=="Dropdown_FrameUnits"){ 
		document.getElementById("Textbox_FrameUnitNo").value = tNewValue;
		document.getElementById("HdnTextbox_FrameUnit").value = tHiddenValue;
		document.getElementById("Textbox_FrameUnitName").value = tName;  
	}else if(unitfor=="ddlVettingUnitType"){
		  //新增審閱單位相關項目 SINCE : NANA5.5.2 MODI BY 4182 IN 20130218 
		document.getElementById("txtVettingUnitID").value = tNewValue;
		document.getElementById("txtVettingUnitName").value =tName;
		document.getElementById("hdnVettingUnitOID").value =  tHiddenValue;  		
	}else if(unitfor=="Dropdown_KeepingUnits"){	
	  document.getElementById("Textbox_KeepingUnitNo").value = tNewValue;
	  document.getElementById("HdnTextbox_KeepingUnit").value = tHiddenValue;
	  document.getElementById("Textbox_KeepingUnitName").value = tName;  
	}else if(unitfor=="Dropdown_IssueUnits"){	
	  if(memberList!=null){
	   for(var i=0;i<memberList.length;i++){
	     tNewValue="";
		   if (typeof(memberList[i].OrgId) != "undefined") {
			   if (memberList[i].OrgId != null && memberList[i].OrgId != "") {
	   			tNewValue = "[" + memberList[i].OrgId + "]" ;
		   	}
		   }
	   	if (typeof(memberList[i].Id) != "undefined") {
	   		if (memberList[i].Id != null && memberList[i].Id != "") {
	   			tNewValue = tNewValue + memberList[i].Id ;
	   		}
	   	}
	   	tName = memberList[i].Name;
		  tHiddenValue = memberList[i].OID;
		  document.getElementById("Textbox_IssueUnitNo").value = tNewValue;
	    document.getElementById("HdnTextbox_IssueUnit").value = tHiddenValue;
	    document.getElementById("Textbox_IssueUnitName").value = tName;  
	    document.getElementById("HdnTextbox_IssueOrg").value = memberList[i].OrganizationOID; 
	    //將選取結果放至Grid中
		  Button_IssueUnitAdd_onclick(); 
     }
    }
	  Grid_IssueUnitObj.clearBinding(); 
	}else if(unitfor=="Dropdown_RelatedUnits"){	
    if(memberList!=null){
	   for(var i=0;i<memberList.length;i++){
	     tNewValue="";
			//20151107 Ts 人员直接取出ID
		   /*if (typeof(memberList[i].OrgId) != "undefined") {
			   if (memberList[i].OrgId != null && memberList[i].OrgId != "") {
	   			tNewValue = "[" + memberList[i].OrgId + "]" ;
		   	}
		   }*/
	   	if (typeof(memberList[i].Id) != "undefined") {
	   		if (memberList[i].Id != null && memberList[i].Id != "") {
	   			tNewValue = tNewValue + memberList[i].Id ;
	   		}
	   	}
	   	tName = memberList[i].Name;
		  tHiddenValue = memberList[i].OID;
		  document.getElementById("Textbox_RelatedUnitNo").value = tNewValue;
	    document.getElementById("HdnTextbox_RelatedUnit").value = tHiddenValue;
	    document.getElementById("Textbox_RelatedUnitName").value = tName; 
	    //將選取結果放至Grid中
		  //Button_AddUnit_onclick(); 
     }
    }
	  Grid_RelateUnitObj.clearBinding(); 
	  document.getElementById("Dropdown_RelatedUnits").value =1;
	}else if(unitfor=="Textbox_RoleName"){	
	  document.getElementById("HdnTextbox_RoleOID").value = tHiddenValue;
	  tName = tName.replace("[", "");
	  tName = tName.replace("]", "_");
	  document.getElementById("Textbox_RoleName").value = tName;  	    
	} 	 
	
  memberList=new Array();
}

//用ajax檢查手動編碼時，文件編號是否重複
function Textbox_DocNo_onchange(){
	var tDocId = trim(document.getElementById("Textbox_DocNo").value);
	//限制長度不可超過30
	if (tDocId.length>30){
		alert("文件編號長度不可超過30!");
		return;
	}
	//alert("Textbox_DocNo_onchange");
	ajax_IsoModuleAccessor.isIdExist(tDocId, loadChkIdExist);
}

 //call back function ajax_IsoModuleAccessor.isIdExist
 function loadChkIdExist(data){   
	   //true 表示文件編號已重複
		alert("loadChkIdExist");
		if (data){
			alert("文件編號已重複"); //文件編號已重複
			document.getElementById("hdnEnableAddDocument").value = "false";
		}else{
			//版號未重複，可以派送
			alert("已確認是可用文件編號"); //已確認是可用文件編號
			document.getElementById("hdnEnableAddDocument").value = "true";
		}
   }
      
 //文件變更
 //文件/工具編號 點擊判斷  
function rdoModDocIsNeed_onclick(){
	if(gRdoModDocIsNeed_1.checked==true){
		alert("警告！\n請詳述不需要之理由，嚴禁僅用'NA'字眼描述！");
		gHdnModDocIsNeed.value = "N";
	}else{
		gHdnModDocIsNeed.value = "Y";
	}
}

function btnModDocNo_onclick(){

     openDialog("/NaNaWeb/GP/WMS/ManageDocument/CreateDocument?hdnMethod=chooseModifyDoc&returnField=HdnTextbox_ModDocDocOID", "500", "300", "titlebar,scrollbars,status,resizable");
	// openDialog("/NaNaWeb/GP/WMS/ManageDocument/CreateDocument?hdnMethod=chooseModifyDoc&returnField=HdnTextbox_DocOID", "500", "300", "titlebar,scrollbars,status,resizable");

}


 function Textbox_DocNo_onchange() {

	var docOID=eval(document.getElementById("HdnTextbox_ModDocDocOID").value);
//alert("docOID="+docOID);
	if(activityId == "Requester"){
		//DWREngine.setAsync(false);//開啟Ajax同步
		ajax_IsoModuleAccessor.getDocumentDTOByOID(docOID[0][0],false,"Last",loadDocReq);
		//DWREngine.setAsync(true);//開啟Ajax同步
		//需要帶出文件類別Grid的值，否則ISODocManager跑不下去		
	}
}

   function loadDocReq(data){
	 document.getElementById("txtModDocNo").value=data.cmItemId;  //文件編號
     document.getElementById("Textbox_ModDocVerNoOld").value=data.document.displayVersion;  //版號
     document.getElementById("Textbox_ModDocDocName").value=data.document.name;  //文件名稱
	 
	 document.getElementById("Textbox_ModDocInvNodDays").value=data.invNodDays;  //失效提前通知日
     document.getElementById("TextArea_ModDocDocAbstract").value=data.document.description;  //文件摘要
     document.getElementById("Dropdown_ModDocFrameUnits").value=data.document.creatUnitType;  //制定單位
     document.getElementById("HdnTextbox_ModDocFrameUnit").value=data.document.creatUnitOID;
     document.getElementById("Textbox_ModDocFrameUnitNo").value=data.document.creatUnitId;
     document.getElementById("Textbox_ModDocFrameUnitName").value=data.document.creatUnitName;
     document.getElementById("Dropdown_ModDocKeepingUnits").value=data.document.rsrvUnitType;  //保管單位
     document.getElementById("HdnTextbox_ModDocKeepingUnit").value=data.document.rsrvUnitOID;
     document.getElementById("Textbox_ModDocKeepingUnitNo").value=data.document.rsrvUnitId;	
     document.getElementById("Textbox_ModDocKeepingUnitName").value=data.document.rsrvUnitName;
     document.getElementById("InputLabel_ModDocAuthor_txt").value=data.document.authorId;  //文件製作者
     document.getElementById("InputLabel_ModDocAuthor_lbl").value=data.document.authorName;	
     document.getElementById("Textbox_ModDocConserveYear").value=data.document.rsrvYear;  //保存年限	
     document.getElementById("ModDoc_Date_SetDate").value=data.document.createdTimeLabel;  //製作日期
     document.getElementById("Date_ModDocEffectDate").value=data.document.validFromLabel;  //生效日期
     document.getElementById("Date_ModDocDeadDate").value=data.document.validToLabel;  //失效日期
     document.getElementById("Date_ModDocConserveDate").value=data.document.rsrvToLabel;  //保存到期日
     document.getElementById("ModDoc_Time_LimitReadFrom").value=data.startReadTimeLabel;  //閱讀時間限制
     document.getElementById("ModDoc_Time_LimitReadTo").value=data.endReadTimeLabel ;
     document.getElementById("Textbox_ModDocReadTime").value=data.hoursOfReadable;  //可閱讀時數
	 }	

function updateSelectedDocumentList() {
	if(activityId=="Requester"){
		//20160108 mode By Hsieh 選擇文件後帶回資料
		Textbox_DocNo_onchange();
	}	
 }

//grid單擊事件
function gridRowClick(pGridId){
	//會簽單位
	if(pGridId=="aw38"){
		gDdlRUFactory.value = gHdnRUFactory.value;
	}
	//主導部門
	if(pGridId=="aw46"){
		
	}
}

function Checkbox_IsConvertPDF_onclick() {
	if (document.getElementById("Checkbox_IsConvertPDF_1").checked) {
		document.getElementById("PDFFileSecurity_0").checked = false;
		document.getElementById("PDFFileSecurity_1").checked = false;
		document.getElementById("PDFFileSecurity_2").checked = false;
		document.getElementById("PDFFileSecurity_0").disabled = true;
		document.getElementById("PDFFileSecurity_1").disabled = true;
		document.getElementById("PDFFileSecurity_2").disabled = true;
	} else {
		document.getElementById("PDFFileSecurity_0").disabled = false;
		document.getElementById("PDFFileSecurity_1").disabled = false;
		document.getElementById("PDFFileSecurity_2").disabled = false;
	}
}

function Button_ModDocAdd_onclick() {
	var msg="";

	var tGridDataRec = Grid_ModDocObj.getData();
	if (tGridDataRec.length > 0) {
		for (var i = 0; i < tGridDataRec.length; i++) {
			if(tGridDataRec[i][5] == gTxtModDocNo.value) {
				msg+="此文件編號已經存在!!\n";
			}
		}
	}
	if(gTxtModDocNo.value!=""&&gRdoModDocIsNeed_0.checked==false&&gRdoModDocIsNeed_1.checked==false){
		msg+="請選擇文件是否需要變更!!\n";
	}
	if(gRdoModDocIsNeed_1.checked==true){
		if(gTxaDocUnNessResason.value==""){
			msg+="請填寫不需要變更原因!!\n";
		}
	} else {
		gTxaDocUnNessResason.value="";
	}
	saveAbortDate();
	if(document.getElementById("ModDoc_AbortDate").value == ""){
		msg+='尚未設定工作行事曆，請聯繫資訊部相關人員處理!!\n';
	}
	if(msg!=""){
		alert(msg);
		return false;
	}else{
		var sql = "select DocCmItem_Category.CategoryOID " +
			"from Documents, ISODocCmItem, DocCmItem_Category " +
			"where Documents.containerOID = ISODocCmItem.OID " +
			"and ISODocCmItem.OID = DocCmItem_Category.DocCmItemOID " +
			"and Documents.OID ='" + document.getElementById('HdnTextbox_ModDocDocOID').value + "'";
		var rs = tNaNaConn.query(sql);
		if (rs.length > 0) {
			DWREngine.setAsync(false);
			ajax_get2ndCategoryOID.get2ndCategorybyOID(rs[0][0], loadQuery);
			DWREngine.setAsync(true);
		}
		Grid_ModDocObj.addRow();
		gGrid_ModDoc.value =Grid_ModDocObj.toArrayString();
		Grid_ModDocObj.clearBinding();
	}
}

function Button_ModDocEdit_onclick() {
	var msg="";

	var tGridDataRec = Grid_ModDocObj.getData();
	if(tGridDataRec[Grid_ModDocObj.getSelectionProperty("index")][36] == "Y") {
		alert("此筆文件編號已經成功自動發起ISO文件變更單，不允許編輯!!");
		return false;
	}
	if (tGridDataRec.length > 0) {
		for (var i = 0; i < tGridDataRec.length; i++) {
			if(Grid_ModDocObj.getSelectionProperty("index")!=i&&tGridDataRec[i][5] == gTxtModDocNo.value) {
				alert("此文件編號已經存在!!");
				return false;
			}
		}
	}
	if(gTxtModDocNo.value!=""&&gRdoModDocIsNeed_0.checked==false&&gRdoModDocIsNeed_1.checked==false){
		msg+="請選擇文件是否需要變更!!\n";
	}
	if(gRdoModDocIsNeed_1.checked==true){
		if(gTxaDocUnNessResason.value==""){
			msg+="請填寫不需要變更原因!!\n";
		}
	} else {
		gTxaDocUnNessResason.value="";
	}
	saveAbortDate();
	if(document.getElementById("ModDoc_AbortDate").value == ""){
		msg+='尚未設定工作行事曆，請聯繫資訊部相關人員處理!!\n';
	}
	if(msg!=""){
		alert(msg);
		return false;
	}else{
		var sql = "select DocCmItem_Category.CategoryOID " +
			"from Documents, ISODocCmItem, DocCmItem_Category " +
			"where Documents.containerOID = ISODocCmItem.OID " +
			"and ISODocCmItem.OID = DocCmItem_Category.DocCmItemOID " +
			"and Documents.OID ='" + document.getElementById('HdnTextbox_ModDocDocOID').value + "'";
		var rs = tNaNaConn.query(sql);
		if (rs.length > 0) {
			DWREngine.setAsync(false);
			ajax_get2ndCategoryOID.get2ndCategorybyOID(rs[0][0], loadQuery);
			DWREngine.setAsync(true);
		}
		Grid_ModDocObj.editRow();
		gGrid_ModDoc.value =Grid_ModDocObj.toArrayString();
		Grid_ModDocObj.clearBinding();
	}
}

function Button_ModDocDel_onclick() {
	var tGridDataRec = Grid_ModDocObj.getData();
	if(tGridDataRec[Grid_ModDocObj.getSelectionProperty("index")][36] == "Y") {
		alert("此筆文件編號已經成功自動發起ISO文件變更單，不允許刪除!!");
		return false;
	}
	Grid_ModDocObj.deleteRow();
	gGrid_ModDoc.value =Grid_ModDocObj.toArrayString();
	Grid_ModDocObj.clearBinding();
}

function loadQuery(data) {
	if (data != "") {
		document.getElementById('hdnModDocDCCGroups').value = data;
	}
}

//存失效日期
function saveAbortDate() {
	var startTime = systemDateTime;
	var myDate = new Date();
	startTime += " " + myDate.getHours(); //获取当前小时数(0-23)
	startTime += ":" + myDate.getMinutes(); //获取当前分钟数(0-59)
	startTime += ":" + myDate.getSeconds(); //获取当前秒数(0-59)
	var workDays = "31";
	DWREngine.setAsync(false);
	ajax_OrgAccessor.fetchWorkDate(userOID, startTime, workDays, loadWorkingDay);
}

//失效日期回调函数
function loadWorkingDay(data) {
	document.getElementById("ModDoc_AbortDate").value = data;
}

function rdoModDocIsNeed_onclick(){
	if(gRdoModDocIsNeed_1.checked==true){
		alert("警告！\n請詳述不需要之理由，嚴禁僅用'NA'字眼描述！");
		gHdnModDocIsNeed.value = "N";
	}else{
		gHdnModDocIsNeed.value = "Y";
	}
}

function txtServiceNo_onblur(){
	var ServiceNo = gTxtServiceNo.value;
	var tsql = " select userName from Users where id = '"+ServiceNo+"'"
          +" and (leaveDate = '' or leaveDate = null or leaveDate is null"
          +" or leaveDate > convert(VARCHAR(100),'"+systemDateTime+"',111))";
	var rs = tNaNaConn.query(tsql);
	if(rs.length > 0){
		gTxtServiceName.value = rs[0][0]==null?"":rs[0][0];
	}else{
		alert("查無此員工代號或員工已離職，請重新輸入!!");
		return false;
	}
}

//$-----Auto generated script block, Please do not edit or modify script below this line.-----$//