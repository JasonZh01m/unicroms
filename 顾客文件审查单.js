/**
*  顾客文件审查单
*  2016.01.20
*  2016/03/22 Add：制定單位預設為申請人主部門資訊
*  2016/03/22 Add：申請人關卡需卡控核准主管欄位必填
*  2016/03/23 Edit：客戶提出客服調整為多筆，故txtServiceNo_onblur程式不執行
*  2016/03/26 Edit：保管單位預設為填單人主部門資訊
*  2016/03/26 Add：針對Grid欄位調整寬度顯示
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
var gDate_EffectDate_txt = document.getElementById("Date_EffectDate_txt");//生效日期
var gDate_EffectDate_btn = document.getElementById("Date_EffectDate_btn");//生效日期
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
var gGrid_RelateUnit_EFGP = document.getElementById("Grid_RelateUnit_EFGP");//会签单位grid
var gTxaRelatedUnitReason = document.getElementById("txaRelatedUnitReason");//DCC签核意见
var gTxaRelatedUnitReason_txt = document.getElementById("txaRelatedUnitReason_txt");//DCC签核意见
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
var tButton_ModDocAdd = document.getElementById('Button_ModDocAdd');
var tButton_ModDocEdit = document.getElementById('Button_ModDocEdit');
var tButton_ModDocDel = document.getElementById('Button_ModDocDel');
var tBtnCustDocOwner = document.getElementById('btnCustDocOwner');

var gGrid_ModDoc = document.getElementById("Grid_ModDoc");//

var gSerialNumber = document.getElementById("SerialNumber");//表單單號

var tGrid_DocCategory = document.getElementById('Grid_DocCategory'); // 文件类别grd
var gTxaServiceReply = document.getElementById('txaServiceReply'); // 客服意见

var tModDocProInstSN = document.getElementById('ModDocProInstSN');
var tHdnModDocOID = document.getElementById('hdnModDocOID');


var hdnCustDocOwnerOID_restore = '';
var txtCustDocOwner_restore = '';
var txtCustDocOwnerName_restore = '';
var hdnModInvoke_restore = '';
var hdnPrice_restore = '';
var hdnModDocDCCGroups_restore = '';
var TextArea_ModDocModreason_restore = '';
var allPowerLevel = "";

var txaFinalManager = document.getElementById('txaFinalManager');  //核准主管
var txaFinalManager_txt = document.getElementById('txaFinalManager_txt');  //核准主管_txt
var txaService = document.getElementById('txaService');  //客服多選
var txaService_txt = document.getElementById('txaService_txt');  //客服多選_txt


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
	var tContactInformationStr1="Label3,Label_DocCategory,Button_DocCategory,grid:Grid_DocCategory,grid:Grid_RelateUnit,Label_defaultCategory,Dropdown_defaultCategory,grid:Grid_ReferDoc,Button_ChooseReferDoc,Btn_DelReferDoc,Label_ISOType,"+
	"Button_ISOTypeAdd,grid:Grid_ISOType,lblClause1,grid:Grid_ISOClause,Label_IssueRole,Textbox_RoleName,Btn_IssueRole,Label_IssueUnit,Dropdown_IssueUnits,Textbox_IssueUnitNo,Btn_IssueUnit,"+
	"Textbox_IssueUnitName,grid:Grid_IssueUnit,XC016,Button_IssueUnitDel,grid:Grid_UpperDoc,Button_ChooseUpperDoc,Btn_DelUpperDoc,Label100,ddlVettingUnitType,txtVettingUnitID,txtVettingUnitName,btnVettingUnit,"+
	"Label97,txtPeriod,Label101,Label95,txtVettingNoticeDay,Label104";

	tArray[0] = "Block_A" + "," + tContactInformationStr1;
    tArray[0] = tArray[0].split(",");
	
	return tArray;      
}

function formCreate(){
	// alert('formCreate');
	
	gInputLabel_Author_lbl.value = userName;
	document.getElementById("hdnAuthorName").value = userName;
	gInputLabel_Author_txt.value = userId;
	gTextbox_KeepingUnitNo.value = mainOrgUnitIds;  //保管單位預設為填單人主部門代號
	gTextbox_KeepingUnitName.value = mainOrgUnitNames;  //保管單位預設為填單人主部門名稱
	gHdnTextbox_KeepingUnit.value = mainOrgUnitOIDs;  //保管單位預設為填單人主部門OID
	
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
	// alert('1');

	/*
	var tGridId = Grid_DocServerObj.getId();    
	var tGridElement_DocServer = document.getElementById(tGridId);   
	tGridElement_DocServer.style.display="none";   //隱藏
	// alert('2');
	document.getElementById("Btn_DocServerAdd").style.display="none";//隱藏
	// alert('2.1');
	hideColumnByPrefix(tFormPrefixDocument,"Block_A");
	document.getElementById(formId + "_shell").style.height = '2190px';

	document.getElementById("Attachment").disabled = false;
	*/
	// alert('2.2\t' + systemDateTime + '\t' + gDate_SetDate.value);
	gDate_SetDate.value = systemDateTime;
	// alert('3');

	setGrid_DocCategory();
	return true;
}
function formOpen(){

	// alert(document.getElementById('SerialNumber').innerHTML);
	if(activityId == 'RelateUnits') {
		gTxtCustDocOwner.value = userId;
		gTxtCustDocOwnerName.value = userName;
		gHdnCustDocOwnerOID.value = userOID;
	}

	setDisable();
	GridStyleSet();
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
	
	
	gTxtApplyDate.value = systemDateTime;
	gBtnPCB_SBU.style.display="none";//隱藏
	gBtnCAR_SBU.style.display="none";//隱藏
	//gBtnService.disabled = true;//唯讀
	//T
	document.getElementById("InputLabel_Author").disabled = true;
	document.getElementById("InputLabel_Author_btn").disabled = true;
	document.getElementById("Dropdown_PowerLevel").disabled = true;
	if(activityId=="Requester"){
		document.getElementById("Dropdown_RelatedUnits").disabled = false;
		document.getElementById("ddlRUFactory").disabled = false;
		document.getElementById("Button_RelatedUnit").disabled = false;
		document.getElementById("Button_EditUnit").disabled = false;
		document.getElementById("Button_DelUnit").disabled = false;
		document.getElementById("Button_EditLeadUnit").disabled = false;
		document.getElementById("Button_DelLeadUnit").disabled = false;
		
		document.getElementById("txaRelatedUnitReason").disabled = false;
		document.getElementById("Dropdown_KeepingUnits").disabled = true;		
		document.getElementById("Textbox_KeepingUnitNo").readOnly = true;
		document.getElementById("Button_KeepingUnit").disabled = true;
		document.getElementById("Textbox_KeepingUnitName").readOnly = true;
		
	}else{
		document.getElementById("Dropdown_RelatedUnits").disabled = true;
		document.getElementById("ddlRUFactory").disabled = true;
		document.getElementById("Button_RelatedUnit").disabled = true;
		document.getElementById("Button_EditUnit").disabled = true;
		document.getElementById("Button_DelUnit").disabled = true;
		document.getElementById("Button_EditLeadUnit").disabled = true;
		document.getElementById("Button_DelLeadUnit").disabled = true;
		
		document.getElementById("txaRelatedUnitReason").disabled = true;
	}
	
	
	// gRdoModDocIsNeed.disabled = true;//唯讀
	setRdoModDocIsNeedDisable(true);

	gTxtModDocNo.disabled = true;//唯讀
	if(activityId=="ISODocManagerConfirm"){
		gDate_EffectDate.disabled = true;
		gDate_EffectDate_btn.disabled = true;
		// gRdoModDocIsNeed.disabled = false;

		gTxtModDocNo.disabled = false;
	}else{
		gDate_EffectDate.disabled=true;
		gDate_EffectDate_btn.disabled = true;
	}
	if(activityId=="RelateUnits"||activityId=="ECNUnitManager"){
		document.getElementById("txtECNNo").disabled = false;
		gBtnECNNo.disabled=false;
		gBtnPCB_SBU.disabled=false;
		gBtnCAR_SBU.disabled=false;
		//gRdoIsNeed.disabled=false;
		gTxaUnNessResason.disabled=false;
		gTxaUnNessResason.readonly=false;
		gTxaUnNessResason.style.display="none";
		// gTxaUnNessResason.value = "test gTxaUnNessResason";

		gDropdown_ECNUnit.disabled=false;
		// gDdlECNFactory.disabled=false;
		// gDropdown_ECNUnit.disabled = false;
		gButton_ModECNEdit.disabled=false;

		tButton_ModDocAdd.disabled = false;
		tButton_ModDocEdit.disabled = false;
		tButton_ModDocDel.disabled = false;

		gRdoIsNeed_0.disabled = false;
		gRdoIsNeed_1.disabled = false;

	}else{
		document.getElementById("txtECNNo").disabled = true;
		gBtnECNNo.disabled=true;
		gBtnPCB_SBU.disabled=true;
		gBtnCAR_SBU.disabled=true;
		//gRdoIsNeed.disabled=true;
		gTxaUnNessResason.disabled=true;
		gTxaUnNessResason.readonly=true;
		gTxaUnNessResason.style.display = "none";
		// gTxaUnNessResason.value = "test gTxaUnNessResason";

		gDropdown_ECNUnit.disabled=true;
		// gDdlECNFactory.disabled=true;
		// gDropdown_ECNUnit.disabled = true;
		gButton_ModECNEdit.disabled=true;

		tButton_ModDocAdd.disabled = true;
		tButton_ModDocEdit.disabled = true;
		tButton_ModDocDel.disabled = true;

		gRdoIsNeed_0.disabled = true;
		gRdoIsNeed_1.disabled = true;
	}
	if(activityId=="RelateUnits"){
		document.getElementById("TextArea_ModDocModreason").value = "此文件變更單係由顧客文件審查單自動發起，單號：\[" + document.getElementById('SerialNumber').innerHTML + "\]";

		// alert('activityId is RelateUnits');
		// gTxtCustDocOwner.value = userId;
		// gTxtCustDocOwnerName.value = userName;
		// gHdnCustDocOwnerOID.value = userOID;

		// alert('gTxtCustDocOwner: ' + gTxtCustDocOwner.value + ' ' +
		// 		'gTxtCustDocOwnerName: ' + gTxtCustDocOwnerName.value + ' ' +
		// 		'gHdnCustDocOwnerOID: ' + gHdnCustDocOwnerOID.value + ' ');

		gButton_ModECNAdd.disabled=false;
		// gButton_ModDocEdit.disabled=false;
		gButton_ModECNDel.disabled=false;
		// gRdoModDocIsNeed.disabled = false;
		// alert('gTxtCustDocOwner: ' + gTxtCustDocOwner.value + ' ' +
		// 		'gTxtCustDocOwnerName: ' + gTxtCustDocOwnerName.value + ' ' +
		// 		'gHdnCustDocOwnerOID: ' + gHdnCustDocOwnerOID.value + ' ');
		gTxtModDocNo.disabled = false;
		
	}
	if(activityId == "ISODocManager" || activityId == "DCC_Check"){
		// gRdoModDocIsNeed.disabled = false;

		gTxtModDocNo.disabled = false;
	}

	//載入機密等級、權限屬性
	DWREngine.setAsync(false);
	getAllPowerLevel();
	// getAllAccessRights();
	DWREngine.setAsync(true);
	document.getElementById("Dropdown_PowerLevel").value = document.getElementById("Hdn_PowerLevel").value;
	if (activityId == "Requester") {
		document.getElementById("Dropdown_PowerLevel").value = "8a8dc21d53933594015393674027000e";
		document.getElementById("Hdn_PowerLevel").value = document.getElementById("Dropdown_PowerLevel").value;
	}

	// test
	// gTxaServiceReply.value = "test";
	// gTxaServiceReply.innerHTML = "test";

	if(activityId == 'Service') {
		// alert('activityId: ' + activityId);
	
		gRdoServiceIsAgree.disabled = false;
		gRdoServiceIsAgree_0.disabled = false;
		gRdoServiceIsAgree_1.disabled = false;
		gRdoServiceIsAgree_2.disabled = false;

		// gTxaServiceReply.readonly = false;
		// gTxaServiceReply.readOnly = false;
		// gTxaServiceReply.value = "test";
		// gTxaServiceReply.innerHTML = "test";
	}

	if(activityId == 'RelateUnits' || activityId == 'ISODocManager' || activityId == 'DCC_Check' || activityId == 'ISODocManagerConfirm') {
		setRdoModDocIsNeedDisable(false);
		tBtnModDocNo.disabled = false;
		tButton_ModDocAdd.disabled = false;
		tButton_ModDocEdit.disabled = false;
		tButton_ModDocDel.disabled = false;
	}

	
	init_for_formOpen();

	getRUFactory();
	//撈取單位主管
	getManager();

	// This block should be put at the last of formOpen method
	// 2016-03-16 move from formCreate
	// alert('hide start: ' + Grid_DocServerObj.getId());
	document.getElementById(Grid_DocServerObj.getId()).style.display = 'none';
	// alert('hide start2');
	document.getElementById("Btn_DocServerAdd").style.display="none";//隱藏
	hideColumnByPrefix(tFormPrefixDocument,"Block_A");
	// alert('hideColumnByPrefix finish');
	document.getElementById(formId + "_shell").style.height = '2310px';
	document.getElementById("Attachment").disabled = false;
	// 2016-03-16 move from formCreate

	document.getElementById('hdnModInvoke').value = 'Y'; // 预设值为Y

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
		// alert('activityId=="Requester"');
		var  time= new Date();	
		//ex.2016/01/11 10:58:55
		gHdnSaveDate.value=systemDateTime+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
		//alert("gHdnSaveDate="+gHdnSaveDate.value);
		//取得填單人之工作日期
		var workDays = "";
		if(gRdoImportant_0.checked==true){
			workDays = 1;
		}else if(gRdoImportant_1.checked==true){
			workDays = 3;
		}
		
		// alert("userOID="+userOID+" ,gHdnSaveDate="+gHdnSaveDate.value+" ,workDays="+workDays);
		DWREngine.setAsync(false);
		ajax_OrgAccessor.fetchWorkDate(userOID,gHdnSaveDate.value,workDays,function(data){
			gHdnLimitDate.value = data;
			// alert('gHdnLimitDate.value: ' + gHdnLimitDate.value);
		});
		DWREngine.setAsync(true);

	}


	// alert('return false;');
	// return false;
	
	
	if(activityId=="ISODocManagerConfirm"){
	// if(activityId=="Requester"){
		// gDate_EffectDate.value = systemDateTime;
		gDate_EffectDate_txt.value = systemDateTime;
		// alert('systemDateTime:' + systemDateTime);
		// alert('gDate_EffectDate_txt.value:' + gDate_EffectDate_txt.value);

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

		setGrid_RelateUnit();

	}

	if(activityId=="RelateUnits"){
		var grdECN = Grid_ECNModRecordObj.getData();
		var flag = "";
		var unitManager = "";
		for(var i=0;i<grdECN.length;i++){
			if(grdECN[i][3]==""){
				flag="Y";
			}
			if(grdECN[i][10] != '') {
				unitManager += grdECN[i][10]+";";
			}
		}
		gHdnGridECNNoIsNull.value = flag;
		// if(unitManager==""){
		// 	alert("部門主管爲空！");
		// 	return false;
		// }else{
		gHdnUnitManagerAppr.value = unitManager;
		// }

	}
	
	

	// document.getElementById('SerialNumber').innerHTML.trim();
	
	
	// alert(gHdnTextbox_RelatedDep.value);
	formSave_end();
	// return false;
	
	//20160322 Add by Bryan 制定單位預設為申請人主部門資訊
	DWREngine.setAsync(false);
	if(activityId == "Requester"){
		gTextbox_FrameUnitNo.value = mainOrgUnitIds;
		gTextbox_FrameUnitName.value = mainOrgUnitNames;
		gHdnTextbox_FrameUnit.value = mainOrgUnitOIDs;
	}
	DWREngine.setAsync(true);

	// alert('return false');
	// return false;
	
	if(activityId == "Service"){
		window.parent.document.forms[0].txaExecutiveComment.value = gTxaServiceReply.value;
	}
	
	
	if(activityId == 'RelateUnits') {
		if(!isGrid_ECNModRecord_containCurrentUser()) {
			alert("請至少填寫一筆ECN是否變更記錄!!");
			return false;
		}	
	}
	
	
	// alert('return false');
	// return false;


	return true;
}

function formSave_end() {
	var grid_RelateUnit_EFGPData = Grid_RelateUnit_EFGPObj.getData();
	// alert('formSave_end\n' + tGrid_RelateUnit_EFGPData);
	var grdUsers_t = '';
   	for(var i = 0; i < grid_RelateUnit_EFGPData.length; i++) {
   		// alert(grid_RelateUnit_EFGPData[i][6]);
   		grdUsers_t += grid_RelateUnit_EFGPData[i][6];
   	}
   	gHdnTextbox_RelatedDep.value = grdUsers_t;
   	// alert('gHdnTextbox_RelatedDep.value: ' + gHdnTextbox_RelatedDep.value);
   	// alert('gHdnUnitManagerAppr.value:' + gHdnUnitManagerAppr.value);

}

//20160323 Add by Bryan 所有關卡檢查簽核意見欄必填
function formDispatch(){

	if(activityId != "Requester"){
	   var tComment=window.parent.document.forms[0].txaExecutiveComment.value;   //取得簽核意見欄位的內容
	   if(tComment==""){    //判斷是否為空值
		  alert("請填寫簽核意見!!");
		   return false;
	   }else{
		  return true;
		}
	  } else {
	  	return true;
	  }
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
	/*
	if(gTxtServiceNo.value==""||gTxtServiceName.value==""){
		msg+="請選擇客服人員!!\n";
	}
	*/
	if(txaService_txt.value==""){
		msg+="請選擇客服人員!!\n";
	}	
	if(gTxtCustCode.value==""){
		msg+="請填寫顧客代碼!!\n";
	}
	if(gTextbox_DocName.value==""){
		msg+="請填寫文件名稱!!\n";
	}
	if(gTextbox_DocNo.value==""){
		msg+="請填寫文件編號!!\n";
	}
	if(gRdoVerType_0.checked==false&&gRdoVerType_1.checked==false&&gRdoVerType_2.checked==false){
		msg+="請選擇版本類別!!\n";
	}
	if(gTextbox_CustomVersion.value==""){
		msg+="請填寫文件版號!!\n";
	}
	if(gDropdown_KeepingUnits.value==""||gTextbox_KeepingUnitNo.value==""){
		msg+="請選擇保管單位!!\n";
	}
	if(gTxaDocDesc.value==""||gTxaDocDesc.value=="請填寫與舊版的差異"){
		msg+="請填寫描述備註!!\n";
	}
	if(gRdoImportant_0.checked==false&&gRdoImportant_1.checked==false){
		msg+="請選擇會簽時效!!\n";
	}
	if(gTxaRelatedUnitReason.value==""){
		msg+="請填寫簽核意見!!\n";
	}	
	var grdRelateUnit = Grid_RelateUnit_EFGPObj.getData();
	if(grdRelateUnit.length<=0){
		msg+="請選擇會簽單位!!\n";
	}
	if(activityId=="Service"){
		if(gRdoServiceIsAgree_0.checked==false&&gRdoServiceIsAgree_1.checked==false&&gRdoServiceIsAgree_2.checked==false){
			msg+="請選擇客服意見匯整是否接受!!\n";
		}
	}
	if(gHdnRelatedUnitIsAgree.value=="X"||gHdnRelatedUnitIsAgree.value=="N"){
		var txaServiceReply_t = trim(gTxaServiceReply.value);
		if(txaServiceReply_t == ""){
			msg+="請填寫客服意見匯整!!\n";
		}
	}
	if(gCheckbox_IsConvertPDF_0.checked==false&&gCheckbox_IsConvertPDF_1.checked==false){
		msg+="請選擇是否轉檔!!\n";
	}else if(gCheckbox_IsConvertPDF_1.checked==false&&gPDFFileSecurity_0.checked==false&&gPDFFileSecurity_1.checked==false&&gPDFFileSecurity_2.checked==false){
		msg+="請選擇文件轉檔後之安全性!!\n";
	}
	
	//20160322 Add by Bryan 申請人關卡需卡控核准主管欄位必填
	if(activityId=="Requester" || activityId=="ISODocManager" || activityId=="DCC_Check"){
		if(txaFinalManager_txt.value==""){
			msg+="請填寫核准主管!!\n";
		}
	}	
	
	//20160322 T 申請人關卡 卡控至少上傳一筆附件
	if(activityId=="Requester"){
		if(document.getElementById("Attachment_shell")!=null){
			
		}else{
			msg+="請至少上傳一筆附件資料!!\n";
		}
	}
	if(activityId=="RelateUnits" || activityId=="ECNUnitManager"){
		// if(gRdoIsNeed_0.checked == true){
		// 	if(document.getElementById("txtECNNo").value=="" ||document.getElementById("txtECNNo").value==null){
		// 		msg+="ECN單號不能爲空!!\n";
		// 	}
		// }
		var gridData = Grid_ECNModRecordObj.getData();
		if(gridData.length == 0) {
			msg+="請至少填寫一筆ECN是否變更記錄!!\n";
		}

	} 
	if(activityId == "RelateUnits") {
		var gridData = Grid_ModDocObj.getData();
		if(gridData.length == 0) {
			msg+="請至少填寫一筆文件/工具是否變更記錄!!\n";
		}

	}
	
	if(msg!=""){
		alert(msg);
		return false;
	}else{
		return true;
	}
}

function Button_ModECNDel_onclick(){
	if(!isGridRowAuthorizedForEdit(Grid_ECNModRecordObj, 0)) {
		return false;
	}
	Grid_ECNModRecordObj.deleteRow();
	gGrid_ECNModRecord.value = Grid_ECNModRecordObj.toArrayString();
	storeNoNeedToClear_forGrid_ECNModRecord();
	Grid_ECNModRecordObj.clearBinding();
	revertNoNeedToClear_forGrid_ECNModRecord();
}

function Button_ModECNEdit_onclick(){
	if(!isGridRowAuthorizedForEdit(Grid_ECNModRecordObj, 0)) {
		return false;
	}

	var msg="";
	if(activityId=="RelateUnits"||activityId=="ECNUnitManager"){
		if(gTxtCustDocOwner.value ==""||gTxtCustDocOwnerName.value ==""){
			msg+="申請人不能爲空!!\n";
		}
		/*if(gTxtECNNo.value!=""){
			if(gRdoIsNeed_0.checked==false&&gRdoIsNeed_1.checked==false){
				msg+="請選擇是否需要變更!!\n";
			}
			if(gRdoIsNeed_1.checked==true){
				if(gTxaUnNessResason.value==""){
					msg+="請填寫不需要變更原因!!\n";
				}
			}
		}else{
			if(gRdoIsNeed_1.checked == false) {
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
		}*/

		if(gRdoIsNeed_0.checked==false&&gRdoIsNeed_1.checked==false){
			msg+="請選擇是否需要變更!!\n";
		}
		if(gRdoIsNeed_0.checked==true) {
			if(gTxtECNNo.value == '') {
				msg += "請選擇ECN單號!!\n";
			}
		} else if (gRdoIsNeed_1.checked==true) {
			/*if(gTxaUnNessResason.value==""){
				msg+="請填寫不需要變更原因!!\n";
			}*/
		}


	}
	if(msg!=""){
		alert(msg);
		return false;
	}else{
		Grid_ECNModRecordObj.editRow();
		gGrid_ECNModRecord.value =Grid_ECNModRecordObj.toArrayString();
		storeNoNeedToClear_forGrid_ECNModRecord();
		Grid_ECNModRecordObj.clearBinding();
		revertNoNeedToClear_forGrid_ECNModRecord();
		resetRdoIsNeed();
	}
}

function Button_ModECNAdd_onclick(){
	var msg="";
	if(activityId=="RelateUnits"){
		if(gTxtCustDocOwner.value ==""||gTxtCustDocOwnerName.value ==""){
			msg+="申請人不能爲空!!\n";
		}
		/*if(gTxtECNNo.value!=""){
			if(gRdoIsNeed_0.checked==false&&gRdoIsNeed_1.checked==false){
				msg+="請選擇是否需要變更!!\n";
			}
			if(gRdoIsNeed_1.checked==true){
				if(gTxaUnNessResason.value==""){
					msg+="請填寫不需要變更原因!!\n";
				}
			}
		}else{
			if(gRdoIsNeed_1.checked == false) {
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
		}*/
		if(gRdoIsNeed_0.checked==false&&gRdoIsNeed_1.checked==false){
			msg+="請選擇是否需要變更!!\n";
		}
		if(gRdoIsNeed_0.checked==true) {
			if(gTxtECNNo.value == '') {
				msg += "請選擇ECN單號!!\n";
			}
		} else if (gRdoIsNeed_1.checked==true) {
			/*if(gTxaUnNessResason.value==""){
				msg+="請填寫不需要變更原因!!\n";
			}*/
		}

	}
	if(msg!=""){
		alert(msg);
		return false;
	}else{
		Grid_ECNModRecordObj.addRow();
		gGrid_ECNModRecord.value =Grid_ECNModRecordObj.toArrayString();
		storeNoNeedToClear_forGrid_ECNModRecord();
		Grid_ECNModRecordObj.clearBinding();
		revertNoNeedToClear_forGrid_ECNModRecord();
		resetRdoIsNeed();
	}
}

/*function btnECNDept_onclick(){
        // var tsql = 	"select CustTB.deptId, CustTB.deptName, Users.id, Users.userName " +
        //    			"from CustFactory_GroupManager CustTB, Users, OrganizationUnit Unit " +
        //    			"where CustTB.deptOID = Unit.OID and Unit.managerOID = Users.OID " +
        //    			"and CustTB.factoryId = '"+gDdlECNFactory.value+"' ";

        var tsql = 	"select CustTB.deptId, CustTB.deptName, Users.id, Users.userName " +
           			"from CustFactory_GroupManager CustTB, Users, OrganizationUnit Unit " +
           			"where CustTB.deptOID = Unit.OID and Unit.managerOID = Users.OID ";

        //alert('for testing in btnECNDept_onclick() sql: ' + tsql);
		var FileName = "SingleOpenWin";
		var SQLClaused = new Array(tsql);
		var SQLLabel = new Array ("部門代號","部門名稱","部門主管代號","部門主管姓名");
		var QBEField = new Array("CustTB.deptId","CustTB.deptName","Users.id","Users.userName");
		var QBELabel = new Array ("部門代號","部門名稱","部門主管代號","部門主管姓名");
		var RetrunId =new Array("txtECNDeptId","txtECNDeptName","hdnECNUnitManager","hdnNull");
		singleOpenWin(FileName,databaseCfgId_EFGP,SQLClaused,SQLLabel,QBEField,QBELabel,RetrunId,700,430);
		   
}*/

function txtECNNo_onchange(){
	if(gTxtECNNo.value==""){
		gDropdown_ECNUnit.disabled = false;
		// gDdlECNFactory.disabled = false;
		// gBtnECNDept.disabled = false;
	}
}

/*function ddlECNFactory_onchange(){
	gHdnECNFactory.value = gDdlECNFactory.value; //將下拉表單value存入隱藏欄位
	gHdnECNFactoryName.value = gDdlECNFactory.options[gDdlECNFactory.selectedIndex].text; //將下拉表單text存入隱藏欄位
	if(gHdnECNFactory.value!="$$$$$$"){
		gBtnECNDept.disabled=false;
	}else{
		gBtnECNDept.disabled=true;
	}
}*/

function rdoIsNeed_onclick(){
	if(gRdoIsNeed_1.checked==true){
		// alert("警告！\n請詳述不需要之理由，嚴禁僅用'NA'字眼描述！");
		gHdnIsNeed.value = "N";
	}else{
		gHdnIsNeed.value = "Y";
	}
	//T
	if(activityId=="RelateUnits" || activityId=="ECNUnitManager"){
		if(gRdoIsNeed_0.checked==true){
			// document.getElementById("btnECNDept").disabled = true;
			// document.getElementById("ddlECNFactory").disabled = true;
			// document.getElementById("Dropdown_ECNUnit").disabled = true;
			document.getElementById("btnECNNo").disabled = false;
			// document.getElementById("ddlECNFactory").value = "$$$$$$";
			// document.getElementById("Dropdown_ECNUnit").value = "1";
			// document.getElementById("txtECNDeptId").value = "";
			// document.getElementById("txtECNDeptName").value = "";
			document.getElementById("hdnECNUnitManager").value = "";
		}else if(gRdoIsNeed_1.checked==true){
			// document.getElementById("btnECNDept").disabled = false;
			// document.getElementById("ddlECNFactory").disabled = false;
			// document.getElementById("Dropdown_ECNUnit").disabled = false;
			document.getElementById("btnECNNo").disabled = true;
			document.getElementById("txtECNNo").value = "";
		}
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
		// alert("OID:"+gHdnProcessInstOID1.value+"\nuserId:"+userId)
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
		tsql = " select Frm03.formSerialNumber, Frm03.aply_name, Convert(varchar(100),Frm03.aply_date,111), "+
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
	// alert('Button_EditLeadUnit_onclick');
	//判斷會簽單位grid是否有值
	// var gridData = Grid_RelateUnitObj.getData();
	var grdRelateUnitData = Grid_RelateUnit_EFGPObj.getData();
	if(grdRelateUnitData.length>=1){
		var tIndex = Grid_RelateUnit_EFGPObj.getSelectionProperty("index");
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
	FormdisplayGridCtrl(Grid_RelateUnit_EFGPObj,document.getElementById("btnRelateUnitOpen"));
}


function Button_EditUnit_onclick(){                      //更新
	if(!(checkFinish("Textbox_RelatedUnitNo","相關單位","",""))){
		return false;
	}
	Grid_RelateUnit_EFGPObj.editRow();  //將Binding欄位的資料填入Grid中 
	Grid_RelateUnit_EFGPObj.clearBinding();  //新增後清除Binding欄位資料   
	document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString();  //將新的資料存入Grid隱藏欄位中
	
	document.getElementById("Textbox_RelatedUnitNo").value="";
	document.getElementById("Textbox_RelatedUnitName").value="";
	document.getElementById("HdnTextbox_RelatedUnit").value="";
	document.getElementById("HdnTextbox_UnitUsers").value="";
	document.getElementById("Dropdown_RelatedUnits").value ="$$$$$$";
	document.getElementById("ddlRUFactory").value ="$$$$$$";
	
}

function Button_DelUnit_onclick(){                      //刪除
	Grid_RelateUnit_EFGPObj.deleteRow();
	document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString();//將新的資料存入Grid隱藏欄位中
	Grid_RelateUnit_EFGPObj.clearBinding();
	
	document.getElementById("Textbox_RelatedUnitNo").value="";
	document.getElementById("Textbox_RelatedUnitName").value="";
	document.getElementById("HdnTextbox_RelatedUnit").value="";
	document.getElementById("HdnTextbox_UnitUsers").value="";
	document.getElementById("Dropdown_RelatedUnits").value ="$$$$$$";
	document.getElementById("ddlRUFactory").value ="$$$$$$";
	
}

function Button_AddUnit_onclick(){                    //新增
	// alert('Button_AddUnit_onclick');
	// alert(Grid_RelateUnit_EFGPObj.getData());
	if(gTextbox_RelatedUnitNo.value==""||gTextbox_RelatedUnitName.value==""){
		alert("會簽部門不能爲空！！");
		return false;
	}
	Grid_RelateUnit_EFGPObj.addRow();
	document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString();//將新的資料存入Grid隱藏欄位中
	// document.getElementById("Textbox_RelatedUnitNo").value="";
	// document.getElementById("Textbox_RelatedUnitName").value="";
	// document.getElementById("HdnTextbox_RelatedUnit").value="";
	// document.getElementById("HdnTextbox_UnitUsers").value="";
	Grid_RelateUnit_EFGPObj.clearBinding();
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
		// alert('checkPointOnClose return relatedUnitNo');
		// alert(Grid_RelateUnit_EFGPObj.getData());
		var strUnitNo="";
		var strUnitName="";
		var strGrpId="";
		var strGrpName="";
		var strGrpOID="";
		var selectvalue =  document.getElementById("Textbox_RelatedUnitNo").value;


		if(selectvalue=="" || selectvalue =="[]"){
			return false;
		}

		var selectvalueArr = eval(selectvalue);

		// alert('selectvalueArr.length: ' + selectvalueArr.length);
		var newArr2 = [];
		for(var i = 0 ; i < selectvalueArr.length; i++){
			strUnitNo = selectvalueArr[i][1];
			strUnitName = selectvalueArr[i][2];
			strGrpId = selectvalueArr[i][3];
			strGrpName = selectvalueArr[i][4];
			strGrpOID = selectvalueArr[i][5];

			// alert('strGrpId:' + strGrpId + ' ' +
			// 	'strGrpName:' + strGrpName + ' ' +
			// 	'strGrpOID:' + strGrpOID + ' ');
			document.getElementById("Textbox_RelatedUnitNo").value=strGrpId;
			document.getElementById("Textbox_RelatedUnitName").value=strGrpName;
			document.getElementById("HdnTextbox_RelatedUnit").value=strGrpOID;

			var tsql = " select Users.id,Users.userName from Users "+
				" join Group_User on Users.OID = Group_User.UserOID "+
				" join Groups on Group_User.GroupOID = Groups.OID "+
				" where GroupOID = '" + strGrpOID + "'";
			// alert('tsql: ' + tsql);
			var rs=tNaNaConn.query(tsql);
			var strUser="";
			if(rs.length>0){  
				for(var j = 0 ; j < rs.length ; j ++)
				strUser+=rs[j][0]+";";
			}
			document.getElementById("HdnTextbox_UnitUsers").value=strUser;


			var newArr = [];
			newArr[0] = document.getElementById('hdnRUFactory').value;
			newArr[1] = document.getElementById('hdnRUFactoryName').value;
			newArr[2] = document.getElementById('Textbox_RelatedUnitNo').value;
			newArr[3] = document.getElementById('Textbox_RelatedUnitName').value;
			newArr[4] = document.getElementById('Dropdown_RelatedUnits').value;
			newArr[5] = document.getElementById('HdnTextbox_RelatedUnit').value;
			newArr[6] = document.getElementById('HdnTextbox_UnitUsers').value;

			newArr2[i] = newArr;

		}

			// alert("newArr2.length\n" + newArr2.length);

			var tGrid_RelateUnit_EFGPData = Grid_RelateUnit_EFGPObj.getData();
			// alert('tGrid_RelateUnit_EFGPData\n' + tGrid_RelateUnit_EFGPData);

			for(var i = 0; i < tGrid_RelateUnit_EFGPData.length; i++) {
				for(j = 0; j < newArr2.length; j++) {
					if(tGrid_RelateUnit_EFGPData[i][0] == newArr2[j][0] || tGrid_RelateUnit_EFGPData[i][4] == newArr2[j][4] || tGrid_RelateUnit_EFGPData[i][5] == newArr2[j][5]) {
						alert("此單位已存在！");
						return false;
					}
				}
			}

			if(newArr2.length > 0) {
				for(var i = 0; i < newArr2.length; i++) {
					tGrid_RelateUnit_EFGPData[tGrid_RelateUnit_EFGPData.length] = newArr2[i];
				}
			}
			// alert('tGrid_RelateUnit_EFGPData\n' + tGrid_RelateUnit_EFGPData);
			Grid_RelateUnit_EFGPObj.reload(tGrid_RelateUnit_EFGPData);
			document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString();

			// Grid_RelateUnit_EFGPObj.addRow();

			//新增
			// if(gTextbox_RelatedUnitNo.value==""||gTextbox_RelatedUnitName.value==""){
			// 	alert("會簽部門不能爲空！！");
			// 	return false;
			// }
			
			
			// var grdRelateUnit = Grid_RelateUnit_EFGPObj.getData();
			// if(grdRelateUnit.length >0){
			// 	for(var i=0;i<grdRelateUnit.length;i++){
			// 		if(grdRelateUnit[i][0]==gDdlRUFactory.value){
			// 			alert("此單位已存在！");
			// 			return false;

			// 		}
			// 	}
			// }
			// Button_AddUnit_onclick();//加入到Grid中


		// } // for(var i = end 
	}	// if(pReturnId end
	
	if(pReturnId == "txtECNNo"){
		if(gDdlPrice.value =="Carrier"){
			var tsql = " select PI.OID "+
			 " from frm_03_carecr Frm03, ProcessInstance PI "+
             " where Frm03.formSerialNumber = '"+gTxtECNNo.value+"'" +
			 " and Frm03.processSerialNumber = PI.serialNumber and PI.currentState <= 3 ";
			var rs=tNaNaConn.query(tsql);
			if(rs.length>0){ 
				gHdnProcessInstOID1.value = rs[0][0];
				// alert(gHdnProcessInstOID1.value);
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
function Button_RelatedUnit_onclick(){ // 相關單位的開窗
	// alert('Button_RelatedUnit_onclick');
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
		/*
		var tsql = " select CustTB.deptId, CustTB.deptName, Groups.id, Groups.groupName,Groups.OID "+
           " from CustFactory_GroupManager CustTB, Groups "+
           " where CustTB.GroupOID = Groups.OID ";
		*/
		
		//alert('for testing in Button_RelatedUnit_onclick() sql: ' + tsql);
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

	document.getElementById("HdnTextbox_UnitUsers").value = vInputLabel.Id;

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
	} else{
		document.getElementById("ddlRUFactory").disabled = false;
	}
	document.getElementById("ddlRUFactory").value = "$$$$$$";
	document.getElementById("Textbox_RelatedUnitNo").value = "";
	document.getElementById("Textbox_RelatedUnitName").value = "";
	
}


//初始化厂别
function getRUFactory(){
	var tSql = " select factoryId, factoryName from CustFactoryDef where isValid = 1 ";
	// var results = tNaNaConn.query(tSql);
	// var drop_str = "'$$$$$$'" + ":" + "'---請選擇---',";
	// for (i=0; i<results.length; i++){  
	// 	drop_str = drop_str + "'" + results[i][0] + "'" + ":" + "'" + results[i][1] + "',";
	// } 

	// alert('drop_str: \n' + drop_str);
	// var drop_count = drop_str.lastIndexOf(","); //去掉逗號
	// var arraydrop_value = drop_str.substring(0, drop_count);  
	// arraydrop_value  = objectEval("{"+arraydrop_value +"}");

	
	// DWRUtil.removeAllOptions(gDdlRUFactory);
	// DWRUtil.addOptions(gDdlRUFactory, arraydrop_value); 
	// DWRUtil.removeAllOptions(gDdlECNFactory);
	// DWRUtil.addOptions(gDdlECNFactory, arraydrop_value); 

	// 2016-03-16
	var rs=tNaNaConn.query(tSql);
    /*if(rs.length>0){
		DWRUtil.removeAllOptions("ddlECNFactory");
        // gDdlRUFactory.options.add(new Option('---請選擇---', '$$$$$$'));
        gDdlECNFactory.options.add(new Option('---請選擇---', '$$$$$$'));
        for(var i = 0 ;i<rs.length; i++){
            var opt = new Option(rs[i][0],rs[i][0]);

            // gDdlRUFactory.options[gDdlRUFactory.length] = opt;
            gDdlECNFactory.options[gDdlECNFactory.length] = opt;
        }
    }*/

    if(rs.length>0){
		DWRUtil.removeAllOptions("ddlRUFactory");
        gDdlRUFactory.options.add(new Option('---請選擇---', '$$$$$$'));
        // gDdlECNFactory.options.add(new Option('---請選擇---', '$$$$$$'));
        for(var i = 0 ;i<rs.length; i++){
            var opt = new Option(rs[i][0],rs[i][0]);

            gDdlRUFactory.options[gDdlRUFactory.length] = opt;
            // gDdlECNFactory.options[gDdlECNFactory.length] = opt;
        }
    }


	 //把選到的值存到隱藏欄位，之後的關卡才能在下拉選單顯示
	if (gHdnRUFactory.value != "") {
		gDdlRUFactory.value=gHdnRUFactory.value;
		gHdnRUFactoryName.value =  gDdlRUFactory.options[gDdlRUFactory.selectedIndex].text; //將下拉表單text存入隱藏欄位
	}
	// else{
	// 	gHdnRUFactory.value = gDdlRUFactory.value; //將下拉表單value存入隱藏欄位
	// 	gHdnRUFactoryName.value = gDdlRUFactory.options[gDdlRUFactory.selectedIndex].text; //將下拉表單text存入隱藏欄位
	// }
	/*if(gHdnECNFactory.value!=""){
		gDdlECNFactory.value=gHdnECNFactory.value;
		gHdnECNFactoryName.value =  gDdlECNFactory.options[gDdlECNFactory.selectedIndex].text; //將下拉表單text存入隱藏欄位
	}*/
	// else{
	// 	gHdnECNFactory.value = gDdlECNFactory.value; //將下拉表單value存入隱藏欄位
	// 	gHdnECNFactoryName.value = gDdlECNFactory.options[gDdlECNFactory.selectedIndex].text; //將下拉表單text存入隱藏欄位
	// }
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
	  Grid_RelateUnit_EFGPObj.clearBinding(); 
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
		return false;
	}
	//alert("Textbox_DocNo_onchange");
	ajax_IsoModuleAccessor.isIdExist(tDocId, loadChkIdExist);
}

 //call back function ajax_IsoModuleAccessor.isIdExist
 function loadChkIdExist(data){   
	   //true 表示文件編號已重複
		// alert("loadChkIdExist");
		if (data){
			alert("文件編號已重複"); //文件編號已重複
			document.getElementById("hdnEnableAddDocument").value = "false";
			document.getElementById("Textbox_DocNo").value = '';
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
		// alert("警告！\n請詳述不需要之理由，嚴禁僅用'NA'字眼描述！");
		gHdnModDocIsNeed.value = "N";
	}else{
		gHdnModDocIsNeed.value = "Y";
	}
}

function btnModDocNo_onclick(){

	// alert('btnModDocNo_onclick');
    openDialog("/NaNaWeb/GP/WMS/ManageDocument/CreateDocument?hdnMethod=chooseModifyDoc&returnField=HdnTextbox_ModDocDocOID", "500", "300", "titlebar,scrollbars,status,resizable");
    // openDialog("/NaNaWeb/GP/WMS/ManageDocument/CreateDocument?hdnMethod=chooseModifyDoc&returnField=hdnModDocOID", "500", "300", "titlebar,scrollbars,status,resizable");
	// openDialog("/NaNaWeb/GP/WMS/ManageDocument/CreateDocument?hdnMethod=chooseModifyDoc&returnField=HdnTextbox_DocOID", "500", "300", "titlebar,scrollbars,status,resizable");
	// alert('HdnTextbox_ModDocDocOID value: ' + document.getElementById('HdnTextbox_ModDocDocOID').value);

}


 function Textbox_DocNo_onchange2() {
 	// alert('Textbox_DocNo_onchange2');
 	// alert(document.getElementById("HdnTextbox_ModDocDocOID").value);
	var docOID=eval(document.getElementById("HdnTextbox_ModDocDocOID").value);

 	// alert('' + eval(document.getElementById("HdnTextbox_ModDocDocOID").value) + '');
 	var arr = docOID;
 	var arr_str = '';
	arr_str += '[[';
	for(var i = 0; i < arr[0].length; i++) {
		arr_str += "'" + arr[0][i] + "'";
		if(i < arr[0].length - 1) {
			arr_str += ',';
		}
	}
	arr_str += ']]';

	// alert(arr_str);

	document.getElementById("HdnTextbox_ModDocDocOID").value = arr_str;

	// alert('docOID\n' + docOID);
	tHdnModDocOID.value = docOID[0][4];
	// alert("tHdnModDocOID.value=" + tHdnModDocOID.value);
	// if(activityId == "Requester"){
		DWREngine.setAsync(false);//開啟Ajax同步
		ajax_IsoModuleAccessor.getDocumentDTOByOID(docOID[0][0],false,"Last",loadDocReq);
		DWREngine.setAsync(true);//開啟Ajax同步
		//需要帶出文件類別Grid的值，否則ISODocManager跑不下去		
	// }
}

   function loadDocReq(data){
   	// alert('loadDocReq');
	 document.getElementById("txtModDocNo").value=data.cmItemId + "";  //文件編號
     document.getElementById("Textbox_ModDocVerNoOld").value=data.document.displayVersion + "";  //版號
     document.getElementById("Textbox_ModDocDocName").value=data.document.name + "";  //文件名稱
	 document.getElementById("Textbox_ModDocInvNodDays").value=data.invNodDays + "";  //失效提前通知日
     document.getElementById("TextArea_ModDocDocAbstract").value=data.document.description + "";  //文件摘要
     document.getElementById("Dropdown_ModDocFrameUnits").value=data.document.creatUnitType + "";  //制定單位
     document.getElementById("HdnTextbox_ModDocFrameUnit").value=data.document.creatUnitOID + "";
     document.getElementById("Textbox_ModDocFrameUnitNo").value=data.document.creatUnitId + "";
     document.getElementById("Textbox_ModDocFrameUnitName").value=data.document.creatUnitName + "";
     document.getElementById("Dropdown_ModDocKeepingUnits").value=data.document.rsrvUnitType + "";  //保管單位
     document.getElementById("HdnTextbox_ModDocKeepingUnit").value=data.document.rsrvUnitOID + "";
     document.getElementById("Textbox_ModDocKeepingUnitNo").value=data.document.rsrvUnitId + "";	
     document.getElementById("Textbox_ModDocKeepingUnitName").value=data.document.rsrvUnitName + "";
     document.getElementById("InputLabel_ModDocAuthor_txt").value=data.document.authorId + "";  //文件製作者
     document.getElementById("InputLabel_ModDocAuthor_lbl").value=data.document.authorName + "";	
     document.getElementById("Textbox_ModDocConserveYear").value=data.document.rsrvYear + "";  //保存年限	
     document.getElementById("ModDoc_Date_SetDate").value=data.document.createdTimeLabel + "";  //製作日期
     document.getElementById("Date_ModDocEffectDate").value=data.document.validFromLabel + "";  //生效日期
     document.getElementById("Date_ModDocDeadDate").value=data.document.validToLabel + "";  //失效日期
     document.getElementById("Date_ModDocConserveDate").value=data.document.rsrvToLabel + "";  //保存到期日
     document.getElementById("ModDoc_Time_LimitReadFrom").value=data.startReadTimeLabel + "";  //閱讀時間限制
     document.getElementById("ModDoc_Time_LimitReadTo").value=data.endReadTimeLabel  + "";
     document.getElementById("Textbox_ModDocReadTime").value=data.hoursOfReadable + "";  //可閱讀時數

	 }	

function updateSelectedDocumentList() {
	// alert('updateSelectedDocumentList');
	// if(activityId=="Requester"){
		//20160108 mode By Hsieh 選擇文件後帶回資料
		Textbox_DocNo_onchange2();
	// }	
 }

//grid單擊事件
function gridRowClick(pGridId){
	//會簽單位
	if (pGridId == Grid_RelateUnit_EFGPObj.getId()) {
		var grid_RelateUnit_EFGPData = Grid_RelateUnit_EFGPObj.getData();
		gDdlRUFactory.value = gHdnRUFactory.value;

		var tIndex = Grid_RelateUnit_EFGPObj.getSelectionProperty("index");

     	var isDdlRUFactory_disabled = grid_RelateUnit_EFGPData[tIndex][4] == 3 ? 'N' : 'Y';
     	if(isDdlRUFactory_disabled == 'Y') {
     		gDdlRUFactory.disabled = true;
     		gDdlRUFactory.value = '$$$$$$';
     	} else {
     		gDdlRUFactory.disabled = false;
     	}

     	

	}
	//主導部門
	if(pGridId=="aw46"){
		
	}


	// 
	if(pGridId == Grid_ECNModRecordObj.getId()) {
		// var grid_ECNModRecordData = Grid_ECNModRecordObj.getData();
		// var tIndex = Grid_ECNModRecordObj.getSelectionProperty("index");
	    // var  = grid_ECNModRecordData[tIndex][4];
	    if(gHdnIsNeed.value == 'Y') {
	    	gRdoIsNeed_0.checked = true;
	    	gRdoIsNeed_1.checked = false;
	    } else {
	    	gRdoIsNeed_0.checked = false;
	    	gRdoIsNeed_1.checked = true;
	    }
	    // alert('gHdnECNFactory.value: ' + gHdnECNFactory.value);
	    /*if(gHdnECNFactory.value != '') {
	    	gDdlECNFactory.value = gHdnECNFactory.value;
	    } else {
	    	gDdlECNFactory.value = '$$$$$$';
	    }*/

     	if(activityId=="RelateUnits" || activityId=="ECNUnitManager"){
			if(gRdoIsNeed_0.checked==true){
				// document.getElementById("btnECNDept").disabled = true;
				// document.getElementById("ddlECNFactory").disabled = true;
				// document.getElementById("Dropdown_ECNUnit").disabled = true;
				document.getElementById("btnECNNo").disabled = false;
				// document.getElementById("ddlECNFactory").value = "$$$$$$";
				// document.getElementById("Dropdown_ECNUnit").value = "1";
				// document.getElementById("txtECNDeptId").value = "";
				// document.getElementById("txtECNDeptName").value = "";
				document.getElementById("hdnECNUnitManager").value = "";
			}else if(gRdoIsNeed_1.checked==true){
				// document.getElementById("btnECNDept").disabled = false;
				// document.getElementById("ddlECNFactory").disabled = false;
				// document.getElementById("Dropdown_ECNUnit").disabled = false;
				document.getElementById("btnECNNo").disabled = true;
				document.getElementById("txtECNNo").value = "";
			}
		}

	}

	if(pGridId == Grid_ModDocObj.getId()) {
		if(gHdnModDocIsNeed.value == 'Y') {
			gRdoModDocIsNeed_0.checked = true;
			gRdoModDocIsNeed_1.checked = false;
			gHdnModDocIsNeed.value = 'Y';
		} else if(gHdnModDocIsNeed.value == 'N') {
			gRdoModDocIsNeed_0.checked = false;
			gRdoModDocIsNeed_1.checked = true;
			gHdnModDocIsNeed.value = 'N';
		}

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

	if(gTxtModDocNo.value == '') {
		msg += "請選擇文件編號!!\n";
	}
	var tGridDataRec = Grid_ModDocObj.getData();
	if (tGridDataRec.length > 0) {
		for (var i = 0; i < tGridDataRec.length; i++) {
			if(tGridDataRec[i][5] == gTxtModDocNo.value) {
				msg+="此文件編號已經存在!!\n";
			}
		}
	}
	if (gTxtModDocNo.value != "" && gRdoModDocIsNeed_0.checked == false && gRdoModDocIsNeed_1.checked == false) {
		msg += "請選擇文件是否需要變更!!\n";
	}
	/*if(gRdoModDocIsNeed_1.checked==true){
		if(gTxaDocUnNessResason.value==""){
			msg+="請填寫不需要變更原因!!\n";
		}
	} else {
		gTxaDocUnNessResason.value="";
	}*/
	saveAbortDate();
	if(document.getElementById("ModDoc_AbortDate").value == ""){
		msg+='尚未設定工作行事曆，請聯繫資訊部相關人員處理!!\n';
	}
	// alert('finish abort date');
	if(msg!=""){
		alert(msg);
		return false;
	}else{
		var sql = "select DocCmItem_Category.CategoryOID " +
			"from Documents, ISODocCmItem, DocCmItem_Category " +
			"where Documents.containerOID = ISODocCmItem.OID " +
			"and ISODocCmItem.OID = DocCmItem_Category.DocCmItemOID " +
			"and Documents.OID ='" + tHdnModDocOID.value + "'";
		// alert(sql);

		var rs = tNaNaConn.query(sql);
		if (rs.length > 0) {
			DWREngine.setAsync(false);
			ajax_get2ndCategoryOID.get2ndCategorybyOID(rs[0][0], loadQuery);
			DWREngine.setAsync(true);
		}
		// alert('phase 2');
		Grid_ModDocObj.addRow();
		gGrid_ModDoc.value = Grid_ModDocObj.toArrayString();
		// alert('gGrid_ModDoc.value:\n' + gGrid_ModDoc.value);
		storeNoNeedToClear_forGrid_ModDoc();
		Grid_ModDocObj.clearBinding();
		revertNoNeedToClear_forGrid_ModDoc();
		resetRdoModDocIsNeed();
		Grid_ModDoc_init();
	}
}

function Button_ModDocEdit_onclick() {
	if(!isGridRowAuthorizedForEdit(Grid_ModDocObj, 2)) {
		return false;
	}
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
	/*if(gRdoModDocIsNeed_1.checked==true){
		if(gTxaDocUnNessResason.value==""){
			msg+="請填寫不需要變更原因!!\n";
		}
	} else {
		gTxaDocUnNessResason.value="";
	}*/
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
			"and Documents.OID ='" + tHdnModDocOID.value + "'";
		var rs = tNaNaConn.query(sql);
		if (rs.length > 0) {
			DWREngine.setAsync(false);
			ajax_get2ndCategoryOID.get2ndCategorybyOID(rs[0][0], loadQuery);
			DWREngine.setAsync(true);
		}
		Grid_ModDocObj.editRow();
		gGrid_ModDoc.value =Grid_ModDocObj.toArrayString();
		storeNoNeedToClear_forGrid_ModDoc();
		Grid_ModDocObj.clearBinding();
		revertNoNeedToClear_forGrid_ModDoc();
		resetRdoModDocIsNeed();
		Grid_ModDoc_init();
	}
}

function Button_ModDocDel_onclick() {
	if(!isGridRowAuthorizedForEdit(Grid_ModDocObj, 2)) {
		return false;
	}

	var tGridDataRec = Grid_ModDocObj.getData();
	if(tGridDataRec[Grid_ModDocObj.getSelectionProperty("index")][36] == "Y") {
		alert("此筆文件編號已經成功自動發起ISO文件變更單，不允許刪除!!");
		return false;
	}
	Grid_ModDocObj.deleteRow();
	gGrid_ModDoc.value = Grid_ModDocObj.toArrayString();
	storeNoNeedToClear_forGrid_ModDoc();
	Grid_ModDocObj.clearBinding();
	revertNoNeedToClear_forGrid_ModDoc();
	Grid_ModDoc_init();
}

function loadQuery(data) {
	// alert('loadQuery');
	if (data != "") {
		data = data.replace(/\[/g, '[');
		data = data.replace(/\]/g, ']');
		document.getElementById('hdnModDocDCCGroups').value = "" + data + "";
	}
	// alert('hdnModDocDCCGroups: ' + document.getElementById('hdnModDocDCCGroups').value);
}

//存失效日期
function saveAbortDate() {
	// alert('saveAbortDate');
	var startTime = systemDateTime;
	var myDate = new Date();
	startTime += " " + myDate.getHours(); //获取当前小时数(0-23)
	startTime += ":" + myDate.getMinutes(); //获取当前分钟数(0-59)
	startTime += ":" + myDate.getSeconds(); //获取当前秒数(0-59)
	var workDays = "31";
	DWREngine.setAsync(false);
	ajax_OrgAccessor.fetchWorkDate(userOID, startTime, workDays, loadWorkingDay);
	DWREngine.setAsync(true);
}

//失效日期回调函数
function loadWorkingDay(data) {
	// alert('loadWorkingDay data: ' + data);
	document.getElementById("ModDoc_AbortDate").value = data;
}

/*function rdoModDocIsNeed_onclick(){
	if(gRdoModDocIsNeed_1.checked==true){
		alert("警告！\n請詳述不需要之理由，嚴禁僅用'NA'字眼描述！");
		gHdnModDocIsNeed.value = "N";
	}else{
		gHdnModDocIsNeed.value = "Y";
	}
}*/

function resetRdoModDocIsNeed() {
	// alert('resetRdoModDocIsNeed');
	gRdoModDocIsNeed_0.checked = false;
	gRdoModDocIsNeed_1.checked = false;
}

function resetRdoIsNeed() {
	// alert('resetRdoIsNeed');
	gRdoIsNeed_0.checked = false;
	gRdoIsNeed_1.checked = false;
}


/* 20160323 Edit by Bryan 客戶提出客服調整為多筆，故程式不執行
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
*/

// 2016-03-15 
function setGrid_DocCategory() {
	// alert('setGrid_DocCategory');
	var tSql = "select OID, nameStack from DocCategory where categoryName = '顧客文件'";
	var rs = tEFGPConn.query(tSql);
	if(rs.length > 0) {
		var rs_0 = rs[0][1].replace('~~', '/');
		rs[0][1] = rs_0;
		Grid_DocCategoryObj.reload(rs);
		tGrid_DocCategory.value = Grid_DocCategoryObj.toArrayString();
	}
}

// 2016-03-15 
function Grid_DocCategory_init() {
	 //取出儲存在隱藏欄位中的Grid資料   
	var grd_DocCategory_value = tGrid_DocCategory.value;//取出儲存在隱藏欄位中的Grid資料  
	if(typeof(grd_DocCategory_value) != "undefined"){//判斷grid物件是否存在表單中   
		if(grd_DocCategory_value.length >1  && (document.getElementById("Grid_DocCategory~~TABLE")==null)){//判斷Grid是否有資料  
			Grid_DocCategoryObj.reload(eval(grd_DocCategory_value));//若Grid有資料則將存於隱藏中的值載入Grid中   
		}   
	}
}

// 2016-03-15
function Grid_RelateUnit_EFGP_init() {
	//取出儲存在隱藏欄位中的Grid資料   
	var grd_RelateUnit_EFGP_value = document.getElementById("Grid_RelateUnit_EFGP").value;//取出儲存在隱藏欄位中的Grid資料  
	if(typeof(grd_RelateUnit_EFGP_value) != "undefined"){//判斷grid物件是否存在表單中   
		if(grd_RelateUnit_EFGP_value.length >1  && (document.getElementById("Grid_RelateUnit_EFGP~~TABLE")==null)){//判斷Grid是否有資料  
			Grid_RelateUnit_EFGPObj.reload(eval(grd_RelateUnit_EFGP_value));//若Grid有資料則將存於隱藏中的值載入Grid中   
		}   
	}
}

// 2016-03-15
function Grid_LeadUnit_init() {
	//取出儲存在隱藏欄位中的Grid資料   
	var grd_LeadUnit_value = document.getElementById("Grid_LeadUnit").value;//取出儲存在隱藏欄位中的Grid資料  
	if(typeof(grd_LeadUnit_value) != "undefined"){//判斷grid物件是否存在表單中   
		if(grd_LeadUnit_value.length >1  && (document.getElementById("Grid_LeadUnit~~TABLE")==null)){//判斷Grid是否有資料  
			Grid_LeadUnitObj.reload(eval(grd_LeadUnit_value));//若Grid有資料則將存於隱藏中的值載入Grid中   
		}   
	}	
}

// 2016-03-15
function Grid_DocServer_init() {
	//取出儲存在隱藏欄位中的Grid資料   
	var grd_DocServer_value = document.getElementById("Grid_DocServer").value;//取出儲存在隱藏欄位中的Grid資料  
	if(typeof(grd_DocServer_value) != "undefined"){//判斷grid物件是否存在表單中   
		if(grd_DocServer_value.length >1  && (document.getElementById("Grid_DocServer~~TABLE")==null)){//判斷Grid是否有資料  
			Grid_DocServerObj.reload(eval(grd_DocServer_value));//若Grid有資料則將存於隱藏中的值載入Grid中   
		}   
	}	
}

// 2016-03-15
function Grid_ECNModRecord_init() {
	//取出儲存在隱藏欄位中的Grid資料   
	var grd_ECNModRecord_value = document.getElementById("Grid_ECNModRecord").value;//取出儲存在隱藏欄位中的Grid資料  
	if(typeof(grd_ECNModRecord_value) != "undefined"){//判斷grid物件是否存在表單中   
		if(grd_ECNModRecord_value.length >1  && (document.getElementById("Grid_ECNModRecord~~TABLE")==null)){//判斷Grid是否有資料  
			Grid_ECNModRecordObj.reload(eval(grd_ECNModRecord_value));//若Grid有資料則將存於隱藏中的值載入Grid中   
		}   
	}	
}

// 2016-03-15
function Grid_ModDoc_init() {
	//取出儲存在隱藏欄位中的Grid資料
	var hdnGrid_ModDoc_v = document.getElementById('hdnGrid_ModDoc').value;  // session bean 回写的grd信息
	// alert('hdnGrid_ModDoc_v:\n' + hdnGrid_ModDoc_v);
	// alert(hdnGrid_ModDoc_v.length);
	// var arr = eval(hdnGrid_ModDoc_v);
	// alert('arr.length: ' + arr.length);

	if(hdnGrid_ModDoc_v == '') {
		var grd_ModDoc_value = document.getElementById("Grid_ModDoc").value;//取出儲存在隱藏欄位中的Grid資料  
		if(typeof(grd_ModDoc_value) != "undefined"){//判斷grid物件是否存在表單中   
			if(grd_ModDoc_value.length >1  && (document.getElementById("Grid_ModDoc~~TABLE")==null)){//判斷Grid是否有資料  
				Grid_ModDocObj.reload(eval(grd_ModDoc_value));//若Grid有資料則將存於隱藏中的值載入Grid中   
			}   
		}	
	} else {
		Grid_ModDocObj.reload(eval(hdnGrid_ModDoc_v));
		gGrid_ModDoc.value =Grid_ModDocObj.toArrayString();
	}

	
}


// @Deprecated 2016-03-15
function hideComponents() {
	// alert('hideComponents');
	var component_str = "Label3,Label_DocCategory,Button_DocCategory,Label_defaultCategory,Dropdown_defaultCategory,Button_ChooseReferDoc,Btn_DelReferDoc,Label_ISOType,"+
		"Button_ISOTypeAdd,lblClause1,Label_IssueRole,Textbox_RoleName,Btn_IssueRole,Label_IssueUnit,Dropdown_IssueUnits,Textbox_IssueUnitNo,Btn_IssueUnit,"+
		"Textbox_IssueUnitName,XC016,Button_IssueUnitDel,Button_ChooseUpperDoc,Btn_DelUpperDoc,Label100,ddlVettingUnitType,txtVettingUnitID,txtVettingUnitName,btnVettingUnit,"+
		"Label97,txtPeriod,Label101,Label95,txtVettingNoticeDay,Label104";

	// document.getElementById('aw36').style.display = 'none';
	// alert('Grid_DocCategoryObj.getId(): ' + Grid_DocCategoryObj.getId());
	document.getElementById(Grid_DocCategoryObj.getId()).style.display = 'none';
	document.getElementById(Grid_ReferDocObj.getId()).style.display = 'none';
	document.getElementById(Grid_ISOTypeObj.getId()).style.display = 'none';
	document.getElementById(Grid_ISOClauseObj.getId()).style.display = 'none';
	document.getElementById(Grid_IssueUnitObj.getId()).style.display = 'none';
	document.getElementById(Grid_UpperDocObj.getId()).style.display = 'none';


	var components = component_str.split(',');
	for(var i = 0; i < components.length; i++) {
		document.getElementById(components[i]).style.display = 'none';
	}
}

// 2016-03-16
function init_for_formOpen() {
	Grid_DocCategory_init();
	Grid_RelateUnit_EFGP_init();
	Grid_RelateUnit_init();
	Grid_LeadUnit_init();
	Grid_DocServer_init();
	Grid_ECNModRecord_init();
	Grid_ModDoc_init();

	if(gHdnPrice.value != '') {
		gDdlPrice.value = gHdnPrice.value;
	}
}

// 2016-03-16
function setDisable() {
	gRdoIsVersionAutoGen.disabled=true;
	gRdoIsVersionAutoGen_0.diabled = true;
	gRdoIsVersionAutoGen_1.diabled = true;
	
	gRdoServiceIsAgree.disabled = true;
	gRdoServiceIsAgree_0.disabled = true;
	gRdoServiceIsAgree_1.disabled = true;
	gRdoServiceIsAgree_2.disabled = true;

	gRdoIsNeed_0.disabled = true;
	gRdoIsNeed_1.disabled = true;

	// gTxaServiceReply.readOnly = true;
	
	gDdlRUFactory.disabled=false;
	gBtnECNNo.disabled=false;
	gBtnPCB_SBU.disabled=false;
	gBtnCAR_SBU.disabled=false;
	//gRdoIsNeed.disabled=false;
	gTxaUnNessResason.disabled=false;
	gDropdown_ECNUnit.style.display="none";

	gButton_ModECNEdit.disabled=false;
	
	gButton_DelUnit.disabled=false;
	gButton_EditUnit.disabled=false;
	gButton_EditLeadUnit.disabled=false;
	gButton_DelLeadUnit.disabled=false;

	gDdlECNFactory.disabled=true;
	gDdlECNFactory.style.display="none";
	gDropdown_ECNUnit.disabled = true;

	gTxaDocUnNessResason.disabled = false;
	gTxaDocUnNessResason.readonly="";
	gTxaDocUnNessResason.style.display="none";

	tBtnModDocNo.disabled = true;
	tButton_ModDocAdd.disabled = true;
	tButton_ModDocEdit.disabled = true;
	tButton_ModDocDel.disabled = true;
	tBtnCustDocOwner.disabled = true;

	document.getElementById('Label_ECNAppNo').style.display = "none";
	document.getElementById('Label_ECNFactory').style.display = "none";
	document.getElementById('Label_ECNDept').style.display = "none";
	gBtnECNDept.style.display = "none";
	gTxtECNDeptId.style.display = "none";
	gTxtECNDeptName.style.display = "none";
}

function setRdoModDocIsNeedDisable(pFlag) {
	// alert('setRdoModDocIsNeedDisable ' + pFlag);
	if(pFlag) {
		gRdoModDocIsNeed_0.disabled = true;
		gRdoModDocIsNeed_1.disabled = true;
		// gTxaDocUnNessResason.disabled = true;
		// gTxaDocUnNessResason.readonly = 'readonly';
	} else {
		gRdoModDocIsNeed_0.disabled = false;
		gRdoModDocIsNeed_1.disabled = false;
		// gTxaDocUnNessResason.disabled = false;
		// gTxaDocUnNessResason.readonly = '';
	}
	
}

function setGrid_RelateUnit() {
	//alert('setGrid_RelateUnit');
	var gRelateUnit_EFGP = Grid_RelateUnit_EFGPObj.getData();
	var arr2 = [];
	if(gRelateUnit_EFGP.length >0){
		for(var i=0;i<gRelateUnit_EFGP.length;i++){
			if(gRelateUnit_EFGP[i][4] != '4') {
				var arr = [];
				arr[0] = gRelateUnit_EFGP[i][2];
				arr[1] = gRelateUnit_EFGP[i][3];
				arr[2] = gRelateUnit_EFGP[i][4];
				arr[3] = gRelateUnit_EFGP[i][5];
				arr[4] = gRelateUnit_EFGP[i][6];

				arr2[i] = arr;	
			}
			
		}
		if(arr2.length > 0) {
			Grid_RelateUnitObj.reload(arr2);
		}
	}

	document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();  //將新的資料存入Grid隱藏欄位中
	//alert('Grid_RelateUnitObj.getData:' + Grid_RelateUnitObj.getData());
	//alert('Grid_RelateUnit.value:' + document.getElementById("Grid_RelateUnit").value);
}

// 2016-03-15
function Grid_RelateUnit_init() {
	//取出儲存在隱藏欄位中的Grid資料   
	var grd_RelateUnit_value = document.getElementById("Grid_RelateUnit").value;//取出儲存在隱藏欄位中的Grid資料  
	if(typeof(grd_RelateUnit_value) != "undefined"){//判斷grid物件是否存在表單中   
		if(grd_RelateUnit_value.length >1  && (document.getElementById("Grid_RelateUnit~~TABLE")==null)){//判斷Grid是否有資料  
			Grid_RelateUnitObj.reload(eval(grd_RelateUnit_value));//若Grid有資料則將存於隱藏中的值載入Grid中   
		}   
	}
}


function getAllPowerLevel() {
	// alert('getAllPowerLevel');
	ajax_IsoModuleAccessor.getAllSecurityLevelForOpenWin(loadAllPowerLevel);
}

function loadAllPowerLevel(data) {
	// alert('loadAllPowerLevel');
	for (var i = 0; i < data.length; i++) {
		allPowerLevel = allPowerLevel + "['" + data[i].OID + "','" + data[i].name + "'],";
	}
	allPowerLevel = "[" + allPowerLevel.substring(0, allPowerLevel.length - 1) + "]";
	queryList(eval(allPowerLevel), "Dropdown_PowerLevel");
	document.getElementById("Dropdown_PowerLevel").value = document.getElementById("Hdn_PowerLevel").value;
}


function queryList(resultList, sel) {
	// alert('queryList');
	var selVer = document.getElementById(sel);

	removeOptions(selVer);
	if ((resultList.length > 0)) {
		appendOptionLast(selVer, "--------------", 0);
		for (var idx = 0; idx < resultList.length; idx++) {
			var opt = appendOptionLast(selVer, resultList[idx][1], resultList[idx][0]);
		}
	}
}
function removeOptions(sel) {
	// alert('removeOptions');
	if (sel.length > 0) {
		var i;
		for (i = sel.length - 1; i >= 0; i--) {
			sel.remove(i);
		}
	}
}
function appendOptionLast(sel, txt, val) {
	// alert('appendOptionLast');
	var newOpt = document.createElement('option');
	newOpt.text = txt;
	newOpt.value = val;
	try {
		sel.add(newOpt, null); // standards compliant; doesn't work in IE
	} catch(e) {
		sel.add(newOpt); // IE only
	}
	return newOpt;
}


function storeNoNeedToClear_forGrid_ModDoc() {

	// alert('in storeNoNeedToClear_forGrid_ModDoc() method:  gTxtCustDocOwner: ' + gTxtCustDocOwner.value + ' ' +
	// 			'gTxtCustDocOwnerName: ' + gTxtCustDocOwnerName.value + ' ' +
	// 			'gHdnCustDocOwnerOID: ' + gHdnCustDocOwnerOID.value + ' ');

	hdnCustDocOwnerOID_restore = document.getElementById('hdnCustDocOwnerOID').value;
	txtCustDocOwner_restore = document.getElementById('txtCustDocOwner').value;
	txtCustDocOwnerName_restore = document.getElementById('txtCustDocOwnerName').value;
	hdnModInvoke_restore = document.getElementById('hdnModInvoke').value;
	hdnPrice_restore = document.getElementById('hdnPrice').value;
	hdnModDocDCCGroups_restore = document.getElementById('hdnModDocDCCGroups').value;
	// TextArea_ModDocModreason_restore = document.getElementById('TextArea_ModDocModreason').value;
	document.getElementById("TextArea_ModDocModreason").value = "此文件變更單係由顧客文件審查單自動發起，單號：\[" + document.getElementById('SerialNumber').innerHTML + "\]";

}

function revertNoNeedToClear_forGrid_ModDoc() {

	document.getElementById('hdnCustDocOwnerOID').value = hdnCustDocOwnerOID_restore;
	document.getElementById('txtCustDocOwner').value = txtCustDocOwner_restore;
	document.getElementById('txtCustDocOwnerName').value = txtCustDocOwnerName_restore;
	document.getElementById('hdnModInvoke').value = hdnModInvoke_restore;
	document.getElementById('hdnPrice').value = hdnPrice_restore;
	document.getElementById('hdnModDocDCCGroups').value = hdnModDocDCCGroups_restore;
	// document.getElementById('TextArea_ModDocModreason').value = TextArea_ModDocModreason_restore;
	document.getElementById("TextArea_ModDocModreason").value = "此文件變更單係由顧客文件審查單自動發起，單號：\[" + document.getElementById('SerialNumber').innerHTML + "\]";


	// alert('in revertNoNeedToClear_forGrid_ModDoc() method:  gTxtCustDocOwner: ' + gTxtCustDocOwner.value + ' ' +
	// 			'gTxtCustDocOwnerName: ' + gTxtCustDocOwnerName.value + ' ' +
	// 			'gHdnCustDocOwnerOID: ' + gHdnCustDocOwnerOID.value + ' ');

}


function storeNoNeedToClear_forGrid_ECNModRecord() {

	hdnCustDocOwnerOID_restore = document.getElementById('hdnCustDocOwnerOID').value;
	txtCustDocOwner_restore = document.getElementById('txtCustDocOwner').value;
	txtCustDocOwnerName_restore = document.getElementById('txtCustDocOwnerName').value;
	// hdnModInvoke_restore = document.getElementById('hdnModInvoke').value;
	// hdnPrice_restore = document.getElementById('hdnPrice').value;
	// hdnModDocDCCGroups_restore = document.getElementById('hdnModDocDCCGroups').value;

}

function revertNoNeedToClear_forGrid_ECNModRecord() {
	document.getElementById('hdnCustDocOwnerOID').value = hdnCustDocOwnerOID_restore;
	document.getElementById('txtCustDocOwner').value = txtCustDocOwner_restore;
	document.getElementById('txtCustDocOwnerName').value = txtCustDocOwnerName_restore;
	// document.getElementById('hdnModInvoke').value = hdnModInvoke_restore;
	// document.getElementById('hdnPrice').value = hdnPrice_restore;
	// document.getElementById('hdnModDocDCCGroups').value = hdnModDocDCCGroups_restore;

}


// 判断Grid_ECNModRecord中是否存在当前user的记录
function isGrid_ECNModRecord_containCurrentUser() {
	var gridData = Grid_ECNModRecordObj.getData();
	var isCurrentUserExist = false;
	for(var i = 0; i < gridData.length; i++) {
		if(gridData[i][0] == userOID) {
			isCurrentUserExist = true;
		}
	}

	return isCurrentUserExist;
}

// 判断Grid_ModDoc中是否存在当前user的记录
/*function isGrid_ModDoc_containCurrentUser() {
	var gridData = Grid_ModDocObj.getData();
	var isCurrentUserExist = false;
	for(var i = 0; i < gridData.length; i++) {
		if(gridData[i][2] == userOID) {
			isCurrentUserExist = true;
		}
	}

	return isCurrentUserExist;
}*/

// Grid row 是否有编辑权限
function isGridRowAuthorizedForEdit(pGridObj, pColIndex) {
	var isGridRowAuthorized = true;
	var gridData = pGridObj.getData();
	var tIndex = pGridObj.getSelectionProperty("index");
	if(gridData[tIndex][pColIndex] != userOID) {
		alert("非本人記錄請重新選擇!");
		isGridRowAuthorized = false;
	}
	return isGridRowAuthorized;
}



//20160326 Add by Bryan
function GridStyleSet(){
	//顧客文件會簽單位	
	if(typeof(Grid_RelateUnit_EFGPObj) != "undefined"){  
		 Grid_RelateUnit_EFGPObj.setColumnIndices([1,2,3,4,6]);  

	document.write("<style>#" + Grid_RelateUnit_EFGPObj.getId() + " .aw-column-1{width:100px;}</style>");
	document.write("<style>#" + Grid_RelateUnit_EFGPObj.getId() + " .aw-column-2{width:90px;}</style>");
	document.write("<style>#" + Grid_RelateUnit_EFGPObj.getId() + " .aw-column-3{width:150px;}</style>");
	document.write("<style>#" + Grid_RelateUnit_EFGPObj.getId() + " .aw-column-4{width:70px;}</style>");
	document.write("<style>#" + Grid_RelateUnit_EFGPObj.getId() + " .aw-column-6{width:250px;}</style>");
	}
	
	//會簽單位主導部門
	if(typeof(Grid_LeadUnitObj) != "undefined"){  
		 Grid_LeadUnitObj.setColumnIndices([1,2,3,4,6]);  

	document.write("<style>#" + Grid_LeadUnitObj.getId() + " .aw-column-1{width:100px;}</style>");
	document.write("<style>#" + Grid_LeadUnitObj.getId() + " .aw-column-2{width:90px;}</style>");
	document.write("<style>#" + Grid_LeadUnitObj.getId() + " .aw-column-3{width:150px;}</style>");
	document.write("<style>#" + Grid_LeadUnitObj.getId() + " .aw-column-4{width:70px;}</style>");
	document.write("<style>#" + Grid_LeadUnitObj.getId() + " .aw-column-6{width:250px;}</style>");
	}	
	
	//ECN變更記錄
	if(typeof(Grid_ECNModRecordObj) != "undefined"){  
		 Grid_ECNModRecordObj.setColumnIndices([1,2,3,4,5,7,8,9]);  

	document.write("<style>#" + Grid_ECNModRecordObj.getId() + " .aw-column-1{width:80px;}</style>");
	document.write("<style>#" + Grid_ECNModRecordObj.getId() + " .aw-column-2{width:80px;}</style>");
	document.write("<style>#" + Grid_ECNModRecordObj.getId() + " .aw-column-3{width:150px;}</style>");
	document.write("<style>#" + Grid_ECNModRecordObj.getId() + " .aw-column-4{width:70px;}</style>");
	document.write("<style>#" + Grid_ECNModRecordObj.getId() + " .aw-column-5{width:200px;}</style>");
	document.write("<style>#" + Grid_ECNModRecordObj.getId() + " .aw-column-7{width:90px;}</style>");
	document.write("<style>#" + Grid_ECNModRecordObj.getId() + " .aw-column-8{width:90px;}</style>");
	document.write("<style>#" + Grid_ECNModRecordObj.getId() + " .aw-column-9{width:200px;}</style>");
	//document.write("<style>#" + Grid_ECNModRecordObj.getId() + " .aw-column-10{width:150px;}</style>");	
	}
	
	//文件工具變更記錄
	if(typeof(Grid_ModDocObj) != "undefined"){  
		 Grid_ModDocObj.setColumnIndices([0,1,3,4,5,8,10,13,14,17,18,20,21,22,28,36,37,38]);  

	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-0{width:70px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-1{width:150px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-3{width:80px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-4{width:80px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-5{width:120px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-8{width:80px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-10{width:150px;}</style>");
	//document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-11{width:150px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-13{width:80px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-14{width:200px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-17{width:150px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-18{width:200px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-20{width:100px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-21{width:200px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-22{width:100px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-28{width:100px;}</style>");
	//document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-33{width:180px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-36{width:100px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-37{width:200px;}</style>");
	document.write("<style>#" + Grid_ModDocObj.getId() + " .aw-column-38{width:150px;}</style>");	
	}		
	
}


//$-----Auto generated script block, Please do not edit or modify script below this line.-----$//