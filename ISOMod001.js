/**
*  ISO 文件變更單
*  將Link由../../../GP/WMS/ 改為 /NaNaWeb/GP/WMS/ SINCE : NANA5.5.2 MODI BY 4182 IN 20121220
*  保存日期直接使用textbox內的日期,不再重轉date型態後再轉回文字 SINCE : NANA5.5.2 MODI BY 4182 IN 20121220
*  增加Grid上下移動功能  SINCE : NANA5.5.2 MODI BY 4182 IN 20121220
*  新增審閱單位相關項目 SINCE : NANA5.5.2 MODI BY 4182 IN 20130218
*  2016/03/19 Add：文件製作者關卡時自動清空失效日期由DCC重新定義
*  2016/03/19 Edit：Grid欄位寬度及顯示欄位	
*  2016/03/22 Add：文件製作者關卡時自動清空前一版本審查週期相關欄位
*  2016/03/22 Add：檢查表單欄位是否必填
**/
//ajax service
document.write('<script type="text/javascript" src="../../js/ds_j.js"></script>');
document.write('<script type="text/javascript" src="../../js/common_util.js" ></script>');
document.write('<script type="text/javascript" src="../../js/ds.js"></script>');
document.write('<script type="text/javascript" src="../../CustomJsLib/EFGPShareMethod.js"></script>'); //表单JS开窗
document.write('<script type="text/javascript" src="../../dwrDefault/engine.js"></script>');
document.write('<script type="text/javascript" src="../../dwrDefault/util.js"></script>');
document.write('<script type="text/javascript" src="../../dwrDefault/interface/ajax_OrgAccessor.js"></script>');
document.write('<script type="text/javascript" src="../../dwrDefault/interface/ajax_ExtOrgAccessor.js"></script>');
document.write('<script type="text/javascript" src="../../dwrDefault/interface/ajax_DatabaseAccessor.js"></script>');
document.write('<script type="text/javascript" src="../../dwrDefault/interface/ajax_IsoModuleAccessor.js"></script>');
document.write('<script type="text/javascript" src="../../CustomJsLib/prefixAction/formComponentAction.js"></script>');
document.write('<script type="text/javascript" src="../../CustomJsLib/prefixDocument/formPrefixDocument.js"></script>');
document.write('<script type="text/javascript" src="/zWARforUnimicron/dwrCustom/interface/ajax_get2ndCategoryOID.js"></script>');
document.write('<script type="text/javascript" src="../../dwrDefault/interface/ajax_CommonAccessor.js"></script>');
//文件欄位變數
if (formMode != "isPrintForm") {
	var setDate = new Date(document.getElementById("Date_SetDate_txt").value);
	var conserveYear = parseFloat(document.getElementById("Textbox_ConserveYear").value);
	var gISOTypeData = document.getElementById("Grid_ISOType").value;
	var gDocCategoryData = document.getElementById("Grid_DocCategory").value;
	var gDocServerData = document.getElementById("Grid_DocServer").value;
	var gReferDocData = document.getElementById("Grid_ReferDoc").value;
	var gIssueUnitData = document.getElementById("Grid_IssueUnit").value;
	var gRelateUnitData = document.getElementById("Grid_RelateUnit").value;
	var gPowerData = document.getElementById("Grid_Power").value;
	var gClauseData = document.getElementById("Grid_ISOClause").value;
	var gUpperDocData = document.getElementById("Grid_UpperDoc").value;
	var gLowerDocData = document.getElementById("Grid_LowerDoc").value;
	//var gFilePolicyData = document.getElementById("Grid_FilePolicy").value;//20130102 Tiffany
	var allPowerLevel = "";
	var allPowerFrom = "";
	var returnValue = true;
	var isUpperDoc = 0;
	//判斷BROWSER類型 SINCE : NANA5.5.2 MODI BY 4182 IN 20121220
	var isIE = navigator.userAgent.search("MSIE") > -1;
	var isFirefox = navigator.userAgent.search("Firefox") > -1;
	var isOpera = navigator.userAgent.search("Opera") > -1;
	var isSafari = navigator.userAgent.search("Safari") > -1; //Google瀏覽器是用這核心
	var thdnDCCGroups = document.getElementById("hdnDCCGroups"); //DCC群组资料隐藏栏位
	var thdnPrice = document.getElementById("hdnPrice"); //事业别隐藏栏位
	var tddlPrice = document.getElementById("ddlPrice"); //事业别
	var tApplyDate = document.getElementById("txtApplyDate"); //申请日期
	var databaseEFGP = "NaNaISO"; //EFGP资料库
	var tEFGPConn = new DataSource(formId, "NaNaISO"); //EFGP
	var databaseCfgId_EFGP = "NaNaISO";
	var databaseCfgId_EF2K = "easyflow70";
	var txaFinalManager = document.getElementById("txaFinalManager"); //核准主管
	var txaFinalManager_txt = document.getElementById("txaFinalManager_txt"); //核准主管_txt
}

function formCreate() {
	document.getElementById("InputLabel_Requester_lbl").value = userName; //預設文件製作者為填表人姓名
	document.getElementById("InputLabel_Requester_txt").value = userId;
	document.getElementById("requestUserOID").value = userOID; //5.5.1.2 記錄變更歷程資料
	var sql = "select OID, id, docServerAddress from DocServer";
	var rs = tEFGPConn.query(sql);
	if (rs.length > 0) {
		var DocServerCreateData = "";
		for (var i = 0; i < rs.length; i++) {
			DocServerCreateData = DocServerCreateData + "['" + rs[i][0] + "','" + rs[i][1] + "','" + rs[i][2] + "'],";
		}
		DocServerCreateData = "[" + DocServerCreateData.substring(0, DocServerCreateData.length - 1) + "]";
		Grid_DocServerObj.reload(eval(DocServerCreateData));
		document.getElementById("Grid_DocServer").value = Grid_DocServerObj.toArrayString();
		document.getElementById("HdnTextbox_DocServer").value = DocServerCreateData;
	}
	return true;
}

function formOpen() {
	//20160321 Add by Bryan 
	document.getElementById("Textbox_CustomVersion").style.display = "none"; 

	//DWREngine.setAsync(false);
	setGridStyle();
	
	if(activityId == "Requester" || activityId == "Applier" || activityId == "RequesterManager" || activityId == "ISODocManager"){
		document.getElementById("ISOMod001_shell").style.height="600px";
	}
	
	document.getElementById("Textbox8").style.display = "none";
	//為手持裝置新增的按鈕 , 只於手持裝置上操作時會出現  SINCE NANA5.5.2 MODI BY 4182 IN 20121220
	var tOS = navigator.userAgent.toLowerCase();
	if (tOS.indexOf('iphone') > 0 || tOS.indexOf('ipad') > 0 || tOS.indexOf('ios') > 0) {
		//do nothing
	} else {
		if (document.getElementById("btnISOClause")) document.getElementById("btnISOClause").style.display = "none";
		if (document.getElementById("btnDocServer")) document.getElementById("btnDocServer").style.display = "none";
		if (document.getElementById("btnReferDoc")) document.getElementById("btnReferDoc").style.display = "none";
		if (document.getElementById("btnRelatedOpen")) document.getElementById("btnRelatedOpen").style.display = "none";
		if (document.getElementById("btnAlRelatedOpen")) document.getElementById("btnAlRelatedOpen").style.display = "none";
		if (document.getElementById("btnUpperDoc")) document.getElementById("btnUpperDoc").style.display = "none";
		if (document.getElementById("btnIssueUnit")) document.getElementById("btnIssueUnit").style.display = "none";
		if (document.getElementById("btnRelateUnit")) document.getElementById("btnRelateUnit").style.display = "none";
		if (document.getElementById("btnPower")) document.getElementById("btnPower").style.display = "none";
	}

	//document.getElementById("btnDocServer").style.display = "none";
	// if(activityId =="Requester" || activityId == "RequesterManager" || activityId == "ISODocManager"){
	// 	document.getElementById("ISOMod001_shell").style.height="600px";
	// }
	if (activityId == "ModDocRequester" || activityId == "ModISODocManager" || activityId == "ModDocRequesterManager" || activityId == "RelateUnits"  || activityId == "ISODocManagerConfirm"  || activityId == "ISODocManagerConfirm2" || activityId =="ACT22") {

		//載入機密等級、權限屬性
		getAllPowerLevel();

		getAllAccessRights();

		document.getElementById("Dropdown_PowerLevel").value = document.getElementById("Hdn_PowerLevel").value;
		reloadGrids();
		setGridStyle(); //設定Grid樣式
		//隱藏下階文件GRID(使用者不得維護下階文件,但資料要帶到後端SO隱藏起來)
		Grid_LowerDocObj.setStyle("display", "none");

	}
	//20160108 add By Hsieh隱藏文件
	if(typeof(Grid_DocCategoryObj) != "undefined"){  //判斷grid物件是否存在表單中  
		if(document.getElementById("Grid_DocCategory").value.length >1 ){  //判斷Grid是否有資料  Q
			Grid_DocCategoryObj.reload(eval(document.getElementById("Grid_DocCategory").value));  //若Grid有資料則將存於隱藏中的值載入Grid中  
		}  
	}
	if(activityId == "ModDocRequesterManager" || activityId == "ISODocManagerConfirm" || activityId == "ISODocManagerConfirm2"){
		reloadGrids();
	}
	
	if (activityId == "Requester" || activityId == "Applier" || activityId == "RequesterManager"){
		var tGridId = Grid_DocCategoryObj.getId();
		var tGridElement = document.getElementById(tGridId);
		tGridElement.style.display = "none";
	}else{
		var tGridId = Grid_DocCategoryObj.getId();
		var tGridElement = document.getElementById(tGridId);
		tGridElement.style.display = "";
	}
	
	
	
	if (activityId == "ModDocRequester" && document.getElementById("Hdn_PowerLevel").value == "") { 

		document.getElementById("Date_SetDate_txt").value = sytemDateTime; //預設製作時間和生效時間為系統時間
		document.getElementById("Date_EffectDate_txt").value = sytemDateTime;
		Textbox_DocNo_onchange(); //load第一關卡隱藏的資訊
	}

	//卡控工作日期不得為空值
	if (activityId == "Requester" && document.getElementById("txtAbortDate").value == "") {
		saveAbortDate();
		document.getElementById("txtAbortDate").value="2016/02/01 00:00:00";
		if (document.getElementById("txtAbortDate").value == ""){
			alert("申請人尚未設定工作行事曆，請聯繫資訊部相關人員處理");
		}
		//document.getElementById("txtAbortDate").value="2015/10/01 00:00:00";
		
	}
	
	

	if (activityId == "ISODocManager" || activityId == "ISODocManager2" || activityId == "ModISODocManager" || activityId == "ModISODocManager2" || activityId == "ISODocManagerConfirm" || activityId == "ISODocManagerConfirm2") {
		document.getElementById("Date_DeadDate_btn").disabled = false;
	} else {
		document.getElementById("Date_DeadDate_btn").disabled = true;
	}
	
	//20160120 add by Hsieh ISODocManager 隱藏欄位
	if(activityId == "ISODocManager"){
		//ISO型態
		var tGridId1 = Grid_ISOTypeObj.getId();
		var tGridElement1 = document.getElementById(tGridId1);
		tGridElement1.style.display = "none";
		document.getElementById("Label_ISOType").style.display="none";
		document.getElementById("Button_ISOTypeAdd").style.display="none";
		//隱藏文件類別
		tGridId1 = Grid_DocCategoryObj.getId();
		tGridElement1 = document.getElementById(tGridId1);
		tGridElement1.style.display = "none";
		document.getElementById("Label_DocCategory").style.display="none";
		document.getElementById("Button_DocCategory").style.display="none";
		//文件檔案
		document.getElementById("Label_Files").style.display="none";	
		document.getElementById("Label81").style.display="none";
		document.getElementById("Label_UploadFile").style.display="none";
		document.getElementById("Label75").style.display="none";
		document.getElementById("Checkbox_IsConvertPDF").style.display="none";
		document.getElementById("PDFFileSecurity").style.display="none";
		document.getElementById("Attachment").style.display="none";
		//參考文件	
		document.getElementById("Label87").style.display="none";
		document.getElementById("Label_ReferDoc").style.display="none";
		document.getElementById("Label88").style.display="none";
		var tGridId2 = Grid_ReferDocObj.getId();
		var tGridElement2 = document.getElementById(tGridId2);
		tGridElement2.style.display = "none";
		document.getElementById("Button_ChooseReferDoc").style.display="none";
		document.getElementById("Btn_DelReferDoc").style.display="none";
		//關聯文件	
		document.getElementById("Label3").style.display="none";
		document.getElementById("Label_RelatedDoc").style.display="none";
		document.getElementById("Label2").style.display="none";
		document.getElementById("Label_NeedMod").style.display="none";
		document.getElementById("rdoNeedMod").style.display="none";
		document.getElementById("Label_RelatedProcessSN").style.display="none";
		document.getElementById("txtRelatedProcessSN").style.display="none";
		document.getElementById("btnRelatedProcessSN").style.display="none";
		tGridId2 = Grid_RelatedDocObj.getId();
		tGridElement2 = document.getElementById(tGridId2);
		tGridElement2.style.display = "none";
		document.getElementById("Button_ChooseReleatedDoc").style.display="none";
		document.getElementById("Btn_EditRelatedDoc").style.display="none";
		document.getElementById("Btn_DelRelatedDoc").style.display="none";
		document.getElementById("btnViewRelatedDoc").style.display="none";
		//被關聯文件	
		document.getElementById("Label12").style.display="none";
		document.getElementById("Label_AlRelatedDoc").style.display="none";
		document.getElementById("Label13").style.display="none";
		document.getElementById("Label_AlNeedMod").style.display="none";
		document.getElementById("rdoAlNeedMod").style.display="none";
		document.getElementById("Label_AlRelatedProcessSN").style.display="none";
		document.getElementById("txtAlRelatedProcessSN").style.display="none";
		document.getElementById("btnAlRelatedProcessSN").style.display="none";
		tGridId2 = Grid_AlRelatedDocObj.getId();
		tGridElement2 = document.getElementById(tGridId2);
		tGridElement2.style.display = "none";
		document.getElementById("Button_ChooseAlReleatedDoc").style.display="none";
		document.getElementById("Btn_EditAlRelatedDoc").style.display="none";
		document.getElementById("Btn_DelAlRelatedDoc").style.display="none";
		document.getElementById("btnViewAlRelatedDoc").style.display="none";
		//上階文件	
		document.getElementById("Label150").style.display="none";
		document.getElementById("Label_UpperDoc").style.display="none";
		document.getElementById("Label151").style.display="none";
		tGridId2 = Grid_UpperDocObj.getId();
		tGridElement2 = document.getElementById(tGridId2);
		tGridElement2.style.display = "none";
		document.getElementById("Button_ChooseUpperDoc").style.display="none";
		document.getElementById("Btn_DelUpperDoc").style.display="none";
		//發行單位	
		document.getElementById("Label96").style.display="none";
		document.getElementById("Label_Issue").style.display="none";
		document.getElementById("Label94").style.display="none";
		document.getElementById("Label_IssueRole").style.display="none";
		document.getElementById("Textbox_RoleName").style.display="none";
		document.getElementById("Btn_IssueRole").style.display="none";
		document.getElementById("Label_IssueUnit").style.display="none";
		document.getElementById("Dropdown_IssueUnits").style.display="none";
		document.getElementById("Textbox_IssueUnitNo").style.display="none";
		document.getElementById("Btn_IssueUnit").style.display="none";
		document.getElementById("Textbox_IssueUnitName").style.display="none";		
		tGridId2 = Grid_IssueUnitObj.getId();
		tGridElement2 = document.getElementById(tGridId2);
		tGridElement2.style.display = "none";
		document.getElementById("Button_IssueUnitDel").style.display="none";
		//會簽單位	
		document.getElementById("Label110").style.display="none";
		document.getElementById("Label_Department").style.display="none";
		document.getElementById("Label112").style.display="none";
		document.getElementById("Label_RelatedUnits").style.display="none";
		document.getElementById("Dropdown_RelatedUnits").style.display="none";
		document.getElementById("Label_RelatedUnit").style.display="none";
		document.getElementById("Textbox_RelatedUnitNo").style.display="none";
		document.getElementById("Button_RelatedUnit").style.display="none";
		document.getElementById("Textbox_RelatedUnitName").style.display="none";	
		tGridId2 = Grid_RelateUnit_EFGPObj.getId();
		tGridElement2 = document.getElementById(tGridId2);
		tGridElement2.style.display = "none";
		document.getElementById("Button_DelUnit").style.display="none";
		document.getElementById("Label_AddSales").style.display="none";
		document.getElementById("txtAddSales").style.display="none";
		document.getElementById("btnAddSales").style.display="none";
		//權限屬性
		document.getElementById("Label113").style.display="none";
		document.getElementById("Label_Power").style.display="none";
		document.getElementById("Label114").style.display="none";
		document.getElementById("Label_PowerFrom").style.display="none";
		document.getElementById("Dropdown_PowerFrom").style.display="none";
		document.getElementById("Label_RelatedUnit").style.display="none";
		document.getElementById("Textbox_RelatedUnitNo").style.display="none";
		document.getElementById("Button_RelatedUnit").style.display="none";
		document.getElementById("Textbox_RelatedUnitName").style.display="none";	
		tGridId2 = Grid_PowerObj.getId();
		tGridElement2 = document.getElementById(tGridId2);
		tGridElement2.style.display = "none";
		document.getElementById("Button_PowerAdd").style.display="none";
		document.getElementById("Button_PowerDel").style.display="none";
		//工程變更單
		document.getElementById("Label22").style.display="none";
		document.getElementById("Label_ECN").style.display="none";
		document.getElementById("Label_ECNNo").style.display="none";
		document.getElementById("Label_ECN_No").style.display="none";		
		document.getElementById("Label26").style.display="none";
		document.getElementById("rdoIsNeed").style.display="none";
		document.getElementById("txtECNNo").style.display="none";
		document.getElementById("btnECNNo").style.display="none";
		document.getElementById("btnPCB_SBU").style.display="none";
		document.getElementById("btnCAR_SBU").style.display="none";
		document.getElementById("rdoAddQC").style.display="none";	
		document.getElementById("txaUnNessResason").style.display="none";	
		document.getElementById("Label_AddQC").style.display="none";	
		document.getElementById("Dropdown_QCUnits").style.display="none";	
		document.getElementById("txtAddQC").style.display="none";	
		document.getElementById("btnAddQC").style.display="none";
		document.getElementById("txtAddQCName").style.display="none";
		//評審設定
		document.getElementById("Label10").style.display="none";
		document.getElementById("Label5").style.display="none";
		document.getElementById("Label4").style.display="none";
		document.getElementById("Label0").style.display="none";
		document.getElementById("ddlVettingUnitType").style.display="none";
		document.getElementById("txtVettingUnitID").style.display="none";
		document.getElementById("btnVettingUnit").style.display="none";
		document.getElementById("txtVettingUnitName").style.display="none";
		document.getElementById("Label11").style.display="none";	
		document.getElementById("txtPeriod").style.display="none";
		document.getElementById("Label7").style.display="none";
		document.getElementById("txtVettingNoticeDay").style.display="none";
		document.getElementById("Label9").style.display="none";
		document.getElementById("Label6").style.display="none";
		
		//ISO附件
		document.getElementById("Label14").style.display="none";
		document.getElementById("Label_ISOFile").style.display="none";
		document.getElementById("Label8").style.display="none";
		document.getElementById("btnOpenISOFiles").style.display="none";
		
		//20160318 add By Hsieh 會簽單位 新增 將原本產品 隱藏
	
		var tGridId3 = Grid_RelateUnitObj.getId();
		var tGridElement3 = document.getElementById(tGridId3);
		tGridElement3.style.display = "none";
		
		
	}else if(activityId != "Requester" && activityId != "Applier" && activityId != "RequesterManager" && activityId != "ISODocManager"){
		
		//ISO型態
		var tGridId1 = Grid_ISOTypeObj.getId();
		var tGridElement1 = document.getElementById(tGridId1);
		tGridElement1.style.display = "";
		document.getElementById("Label_ISOType").style.display="";
		document.getElementById("Button_ISOTypeAdd").style.display="";
		//隱藏文件類別
		tGridId1 = Grid_DocCategoryObj.getId();
		tGridElement1 = document.getElementById(tGridId1);
		tGridElement1.style.display = "";
		document.getElementById("Label_DocCategory").style.display="";
		document.getElementById("Button_DocCategory").style.display="";
		//文件檔案
		document.getElementById("Label_Files").style.display="";	
		document.getElementById("Label81").style.display="";
		document.getElementById("Label_UploadFile").style.display="";
		document.getElementById("Label75").style.display="";
		document.getElementById("Checkbox_IsConvertPDF").style.display="";
		document.getElementById("PDFFileSecurity").style.display="";
		document.getElementById("Attachment").style.display="";
		//參考文件	
		document.getElementById("Label87").style.display="";
		document.getElementById("Label_ReferDoc").style.display="";
		document.getElementById("Label88").style.display="";
		var tGridId2 = Grid_ReferDocObj.getId();
		var tGridElement2 = document.getElementById(tGridId2);
		tGridElement2.style.display = "";
		document.getElementById("Button_ChooseReferDoc").style.display="";
		document.getElementById("Btn_DelReferDoc").style.display="";
		//關聯文件	
		document.getElementById("Label3").style.display="";
		document.getElementById("Label_RelatedDoc").style.display="";
		document.getElementById("Label2").style.display="";
		document.getElementById("Label_NeedMod").style.display="";
		document.getElementById("rdoNeedMod").style.display="";
		document.getElementById("Label_RelatedProcessSN").style.display="";
		document.getElementById("txtRelatedProcessSN").style.display="";
		document.getElementById("btnRelatedProcessSN").style.display="";
		tGridId2 = Grid_RelatedDocObj.getId();
		tGridElement2 = document.getElementById(tGridId2);
		tGridElement2.style.display = "";
		document.getElementById("Button_ChooseReleatedDoc").style.display="";
		document.getElementById("Btn_EditRelatedDoc").style.display="";
		document.getElementById("Btn_DelRelatedDoc").style.display="";
		document.getElementById("btnViewRelatedDoc").style.display="";
		//被關聯文件	
		document.getElementById("Label12").style.display="";
		document.getElementById("Label_AlRelatedDoc").style.display="";
		document.getElementById("Label13").style.display="";
		document.getElementById("Label_AlNeedMod").style.display="";
		document.getElementById("rdoAlNeedMod").style.display="";
		document.getElementById("Label_AlRelatedProcessSN").style.display="";
		document.getElementById("txtAlRelatedProcessSN").style.display="";
		document.getElementById("btnAlRelatedProcessSN").style.display="";
		tGridId2 = Grid_AlRelatedDocObj.getId();
		tGridElement2 = document.getElementById(tGridId2);
		tGridElement2.style.display = "";
		document.getElementById("Button_ChooseAlReleatedDoc").style.display="";
		document.getElementById("Btn_EditAlRelatedDoc").style.display="";
		document.getElementById("Btn_DelAlRelatedDoc").style.display="";
		document.getElementById("btnViewAlRelatedDoc").style.display="";
		//上階文件	
		document.getElementById("Label150").style.display="";
		document.getElementById("Label_UpperDoc").style.display="";
		document.getElementById("Label151").style.display="";
		tGridId2 = Grid_UpperDocObj.getId();
		tGridElement2 = document.getElementById(tGridId2);
		tGridElement2.style.display = "";
		document.getElementById("Button_ChooseUpperDoc").style.display="";
		document.getElementById("Btn_DelUpperDoc").style.display="";
		//發行單位	
		document.getElementById("Label96").style.display="";
		document.getElementById("Label_Issue").style.display="";
		document.getElementById("Label94").style.display="";
		document.getElementById("Label_IssueRole").style.display="";
		document.getElementById("Textbox_RoleName").style.display="";
		document.getElementById("Btn_IssueRole").style.display="";
		document.getElementById("Label_IssueUnit").style.display="";
		document.getElementById("Dropdown_IssueUnits").style.display="";
		document.getElementById("Textbox_IssueUnitNo").style.display="";
		document.getElementById("Btn_IssueUnit").style.display="";
		document.getElementById("Textbox_IssueUnitName").style.display="";		
		tGridId2 = Grid_IssueUnitObj.getId();
		tGridElement2 = document.getElementById(tGridId2);
		tGridElement2.style.display = "";
		document.getElementById("Button_IssueUnitDel").style.display="";
		//會簽單位	
		document.getElementById("Label110").style.display="";
		document.getElementById("Label_Department").style.display="";
		document.getElementById("Label112").style.display="";
		document.getElementById("Label_RelatedUnits").style.display="";
		document.getElementById("Dropdown_RelatedUnits").style.display="";
		document.getElementById("Label_RelatedUnit").style.display="";
		document.getElementById("Textbox_RelatedUnitNo").style.display="";
		document.getElementById("Button_RelatedUnit").style.display="";
		document.getElementById("Textbox_RelatedUnitName").style.display="";	
		tGridId2 = Grid_RelateUnit_EFGPObj.getId();
		tGridElement2 = document.getElementById(tGridId2);
		tGridElement2.style.display = "";
		document.getElementById("Button_DelUnit").style.display="";
		document.getElementById("Label_AddSales").style.display="";
		document.getElementById("txtAddSales").style.display="";
		document.getElementById("btnAddSales").style.display="";
		//權限屬性
		document.getElementById("Label113").style.display="";
		document.getElementById("Label_Power").style.display="";
		document.getElementById("Label114").style.display="";
		document.getElementById("Label_PowerFrom").style.display="";
		document.getElementById("Dropdown_PowerFrom").style.display="";
		document.getElementById("Label_RelatedUnit").style.display="";
		document.getElementById("Textbox_RelatedUnitNo").style.display="";
		document.getElementById("Button_RelatedUnit").style.display="";
		document.getElementById("Textbox_RelatedUnitName").style.display="";	
		tGridId2 = Grid_PowerObj.getId();
		tGridElement2 = document.getElementById(tGridId2);
		tGridElement2.style.display = "";
		document.getElementById("Button_PowerAdd").style.display="";
		document.getElementById("Button_PowerDel").style.display="";
		//工程變更單
		document.getElementById("Label22").style.display="";
		document.getElementById("Label_ECN").style.display="";
		document.getElementById("Label_ECNNo").style.display="";
		document.getElementById("Label_ECN_No").style.display="";		
		document.getElementById("Label26").style.display="";
		document.getElementById("rdoIsNeed").style.display="";
		document.getElementById("txtECNNo").style.display="";
		document.getElementById("btnECNNo").style.display="";
		document.getElementById("btnPCB_SBU").style.display="";
		document.getElementById("btnCAR_SBU").style.display="";
		document.getElementById("rdoAddQC").style.display="";	
		document.getElementById("txaUnNessResason").style.display="";	
		document.getElementById("Label_AddQC").style.display="";	
		document.getElementById("Dropdown_QCUnits").style.display="";	
		document.getElementById("txtAddQC").style.display="";	
		document.getElementById("btnAddQC").style.display="";
		document.getElementById("txtAddQCName").style.display="";
		//評審設定
		document.getElementById("Label10").style.display="";
		document.getElementById("Label5").style.display="";
		document.getElementById("Label4").style.display="";
		document.getElementById("Label0").style.display="";
		document.getElementById("ddlVettingUnitType").style.display="";
		document.getElementById("txtVettingUnitID").style.display="";
		document.getElementById("btnVettingUnit").style.display="";
		document.getElementById("txtVettingUnitName").style.display="";
		document.getElementById("Label11").style.display="";	
		document.getElementById("txtPeriod").style.display="";
		document.getElementById("Label7").style.display="";
		document.getElementById("txtVettingNoticeDay").style.display="";
		document.getElementById("Label9").style.display="";
		document.getElementById("Label6").style.display="";
		
		//ISO附件
		document.getElementById("Label14").style.display="";
		document.getElementById("Label_ISOFile").style.display="";
		document.getElementById("Label8").style.display="";
		document.getElementById("btnOpenISOFiles").style.display="";
		
		//20160318 add By Hsieh 會簽單位 新增 將原本產品 隱藏
		
		reloadGrids();
		
		var tGridId3 = Grid_RelateUnitObj.getId();
		var tGridElement3 = document.getElementById(tGridId3);
		tGridElement3.style.display = "none";
		
		
	}
	if(activityId == "Requester" || activityId == "Applier" || activityId == "RequesterManager" ){
		var tGridId = Grid_RelateUnit_EFGPObj.getId();
		tGridElement = document.getElementById(tGridId);
		tGridElement.style.display = "none";
	}
	
	if (activityId != "Requester" && activityId != "Applier" && activityId != "RequesterManager" ) {
		var tGridId = Grid_LowerDocObj.getId();
		var tGridElementa = document.getElementById(tGridId);
		tGridElementa.style.display = "none";
		//ISO條文區塊指定隱藏
		document.getElementById("lblISOClause").style.display = "none";
		var tGridId = Grid_ISOClauseObj.getId();
		var tGridElement = document.getElementById(tGridId);
		tGridElement.style.display = "none";
		//document.getElementById("Button_ISOClauseAdd").style.display="none";
		//document.getElementById("Button_ISOClauseDel").style.display="none";
		//document.getElementById("btnISOClause").style.display="none";
		//关联文件检视文件档案Grid隐藏
		var tGridId4 = Grid_ViewRelatedDocObj.getId();
		var tGridElement4 = document.getElementById(tGridId4);
		tGridElement4.style.display = "none";
		//被关联文件检视文件档案Grid隐藏
		var tGridId5 = Grid_ViewAlRelatedDocObj.getId();
		var tGridElement5 = document.getElementById(tGridId5);
		tGridElement5.style.display = "none";	
		document.getElementById("txtRelatedProcessSN").readOnly = true;
		document.getElementById("txtAlRelatedProcessSN").readOnly = true;
		document.getElementById("txtAddQC").readOnly = true;
		document.getElementById("txtAddQCName").readOnly = true;
		document.getElementById("Textbox_RoleName").readOnly = true;
		document.getElementById("Textbox_IssueUnitNo").readOnly = true;
		document.getElementById("Textbox_IssueUnitName").readOnly = true;
		document.getElementById("Textbox_RelatedUnitNo").readOnly = true;
		document.getElementById("Textbox_RelatedUnitName").readOnly = true;
		document.getElementById("txtAddSales").readOnly = true;
		document.getElementById("txtVettingUnitID").readOnly = true;
		document.getElementById("txtVettingUnitName").readOnly = true;

		//活動關卡代號 ModDocRequester 允許編輯
		if (activityId == "ModDocRequester") {
			document.getElementById("Dropdown_FrameUnits").disabled = true;
			document.getElementById("Button_FrameUnit").disabled = true;
			document.getElementById("Button_KeepingUnit").disabled = true;
			document.getElementById("Textbox_FrameUnitNo").readOnly = true;
			document.getElementById("Dropdown_KeepingUnits").disabled = true;
			document.getElementById("Textbox_KeepingUnitNo").readOnly = true;
			document.getElementById("Textbox_FrameUnitName").readOnly = true;
			document.getElementById("Textbox_KeepingUnitName").readOnly = true;
			document.getElementById("Dropdown_PowerLevel").disabled = true;
			document.getElementById("Button_ISOTypeAdd").disabled = false;
			document.getElementById("Button_DocCategory").disabled = true;
			document.getElementById("Attachment").disabled = false;
			document.getElementById("rdoIsNeed").disabled = false;
			document.getElementById("txaUnNessResason").readOnly = false;
			document.getElementById("rdoNeedMod").disabled = false;
			document.getElementById("btnRelatedProcessSN").disabled = false;
			document.getElementById("btnRelatedOpen").disabled = false;
			document.getElementById("Button_ChooseReleatedDoc").disabled = false;
			document.getElementById("Btn_EditRelatedDoc").disabled = false;
			document.getElementById("Btn_DelRelatedDoc").disabled = false;
			document.getElementById("rdoAlNeedMod").disabled = false;
			document.getElementById("btnAlRelatedProcessSN").disabled = false;
			document.getElementById("btnAlRelatedOpen").disabled = false;
			document.getElementById("Button_ChooseAlReleatedDoc").disabled = false;
			document.getElementById("Btn_EditAlRelatedDoc").disabled = false;
			document.getElementById("Btn_DelAlRelatedDoc").disabled = false;
			document.getElementById("txtApplyDate").readOnly = true;
			document.getElementById("txtAbortDate").readOnly = true;
			document.getElementById("Textbox_VerNoOld").readOnly = true;
			document.getElementById("Date_ConserveDate_btn").disabled = true;
			document.getElementById("Date_SetDate_btn").disabled = true;
			document.getElementById("Date_EffectDate_btn").disabled = true;
			document.getElementById("Date_DeadDate_btn").disabled = true;
			document.getElementById("Date_ConserveDate_txt").disabled = true;
			document.getElementById("Date_SetDate_txt").disabled = true;
			document.getElementById("Date_EffectDate_txt").disabled = true;
			document.getElementById("Date_DeadDate_txt").disabled = true;	
			document.getElementById("Button_ChooseNo").disabled = true;			
			if (document.getElementById("hdnPrice").value != "Carrier") {
				document.getElementById("btnAddSales").disabled = false;
			} else {
				document.getElementById("btnAddSales").disabled = true;
			}
			document.getElementById("btnECNNo").disabled = false;
			document.getElementById("btnPCB_SBU").disabled = false;
			document.getElementById("btnCAR_SBU").disabled = false;
			document.getElementById("InputLabel_Author_btn").disabled = false;
		} else {
			document.getElementById("Dropdown_FrameUnits").disabled = true;
			document.getElementById("Button_FrameUnit").disabled = true;
			document.getElementById("Button_KeepingUnit").disabled = true;
			document.getElementById("Textbox_FrameUnitNo").readOnly = true;
			document.getElementById("Dropdown_KeepingUnits").disabled = true;
			document.getElementById("Textbox_KeepingUnitNo").readOnly = true;
			document.getElementById("Textbox_FrameUnitName").readOnly = true;
			document.getElementById("Textbox_KeepingUnitName").readOnly = true;
			document.getElementById("Dropdown_PowerLevel").disabled = true;
			document.getElementById("Button_ISOTypeAdd").disabled = true;
			document.getElementById("Button_DocCategory").disabled = true;
			document.getElementById("Attachment").disabled = true;
			document.getElementById("rdoIsNeed").disabled = true;
			document.getElementById("txaUnNessResason").disabled = true;
			document.getElementById("rdoNeedMod").disabled = true;
			document.getElementById("btnRelatedProcessSN").disabled = true;
			document.getElementById("btnRelatedOpen").disabled = true;
			document.getElementById("Button_ChooseReleatedDoc").disabled = true;
			document.getElementById("Btn_EditRelatedDoc").disabled = true;
			document.getElementById("Btn_DelRelatedDoc").disabled = true;
			document.getElementById("rdoAlNeedMod").disabled = true;
			document.getElementById("btnAlRelatedProcessSN").disabled = true;
			document.getElementById("btnAlRelatedOpen").disabled = true;
			document.getElementById("Button_ChooseAlReleatedDoc").disabled = true;
			document.getElementById("Btn_EditAlRelatedDoc").disabled = true;
			document.getElementById("Btn_DelAlRelatedDoc").disabled = true;
			document.getElementById("btnAddSales").disabled = true;
			document.getElementById("btnECNNo").disabled = true;
			document.getElementById("btnPCB_SBU").disabled = true;
			document.getElementById("btnCAR_SBU").disabled = true;
			document.getElementById("InputLabel_Author_btn").disabled = true;
		}

		//ModISODocManager/ISODocManagerConfirm/ISODocManagerConfirm2活動關卡代號允許編輯
		if (activityId == "ModISODocManager" || activityId == "ISODocManagerConfirm" || activityId == "ISODocManagerConfirm2") {
			document.getElementById("Checkbox_IsConvertPDF").disabled = false;
			document.getElementById("PDFFileSecurity").disabled = false;
			//document.getElementById("btnRefOpen").disabled= false;
			document.getElementById("Button_ChooseReferDoc").disabled = false;
			document.getElementById("Btn_DelReferDoc").disabled = false;
			document.getElementById("btnReferDoc").disabled = false;
			document.getElementById("btnUpperDoc").disabled = false;
			document.getElementById("Button_ChooseUpperDoc").disabled = false;
			document.getElementById("Btn_DelUpperDoc").disabled = false;
			document.getElementById("Dropdown_PowerFrom").disabled = false;
			document.getElementById("btnPower").disabled = false;
			document.getElementById("Button_PowerAdd").disabled = false;
			document.getElementById("Button_PowerDel").disabled = false;
			
			
		} else {
			document.getElementById("Checkbox_IsConvertPDF").disabled = true;
			document.getElementById("PDFFileSecurity").disabled = true;
			//document.getElementById("btnRefOpen").disabled= true;
			document.getElementById("Button_ChooseReferDoc").disabled = true;
			document.getElementById("Btn_DelReferDoc").disabled = true;
			document.getElementById("btnReferDoc").disabled = true;
			document.getElementById("btnUpperDoc").disabled = true;
			document.getElementById("Button_ChooseUpperDoc").disabled = true;
			document.getElementById("Btn_DelUpperDoc").disabled = true;
			document.getElementById("Dropdown_PowerFrom").disabled = true;
			document.getElementById("btnPower").disabled = true;
			document.getElementById("Button_PowerAdd").disabled = true;
			document.getElementById("Button_PowerDel").disabled = true;
		}
		/*
		if(activityId == "ModDocRequester"){
			document.getElementById("rdoAddQC").disabled = false;
			document.getElementById("Dropdown_QCUnits").disabled = false;
			document.getElementById("btnAddQC").disabled = false;
		}else{
			document.getElementById("rdoAddQC").disabled = true;
			document.getElementById("Dropdown_QCUnits").disabled = true;
			document.getElementById("btnAddQC").disabled = true;
		}
		*/
			//文件伺服器Grid及按鈕隱藏
		document.getElementById("btnDocServer").style.display = "none";
		document.getElementById("Btn_DocServerAdd").style.display = "none";
		document.getElementById("Btn_DocServerDel").style.display = "none";
		document.getElementById("Label_DocServer").style.display = "none";
		var tGridId2 = Grid_DocServerObj.getId();
		var tGridElement2 = document.getElementById(tGridId2);
		tGridElement2.style.display = "none";
		
		//20160120 mod by Hsieh 
		if (activityId == "ModDocRequester") {
			if(document.getElementById("HdnTextbox_RelatedDoc").value==""){
				var sql1 = "select CM.OID, Doc_Rel.Related_docNo, Doc_Rel.Related_docName, " + "Doc.displayVersion from CustDoc_RelatedDoc Doc_Rel " + "left join ISODocCmItem CM on CM.id = Doc_Rel.Related_docNo " + "left join Documents Doc on Doc.containerOID = CM.OID " + "where Doc_Rel.docNo = '" + document.getElementById("Textbox_DocNo").value + "' " + "and Doc.docStatus = 'RELEASED' order by Doc_Rel.Related_docNo asc";
				var rs = tEFGPConn.query(sql1);
				if (rs.length > 0) {
					//關聯文件
					//rs = eval(document.getElementById("HdnTextbox_RelatedDoc").value);
					var tHdnRelatedDocData = "";				
					for (var i = 0; i < rs.length; i++) {
						tHdnRelatedDocData = tHdnRelatedDocData + "['" + rs[i][0] + "','" + rs[i][1] + "','" + rs[i][2] + "','" + rs[i][3] + "','',''],";
					}
					tHdnRelatedDocData = "[" + tHdnRelatedDocData.substring(0, tHdnRelatedDocData.length - 1) + "]";
					//rs = tHdnRelatedDocData;
					Grid_RelatedDocObj.reload(eval(tHdnRelatedDocData));
					document.getElementById("Grid_RelatedDoc").value = Grid_RelatedDocObj.toArrayString();
					document.getElementById("HdnTextbox_RelatedDoc").value = Grid_RelatedDocObj.toArrayString();
				}
			}else{
				var rs = eval(document.getElementById("HdnTextbox_RelatedDoc").value);
				var tHdnRelatedDocData = "";				
				for (var i = 0; i < rs.length; i++) {
					tHdnRelatedDocData = tHdnRelatedDocData + "['" + rs[i][0] + "','" + rs[i][1] + "','" + rs[i][2] + "','" + rs[i][3] + "','"+rs[i][4]+"','"+rs[i][5]+"'],";
				}
				tHdnRelatedDocData = "[" + tHdnRelatedDocData.substring(0, tHdnRelatedDocData.length - 1) + "]";
				rs = tHdnRelatedDocData;
				Grid_RelatedDocObj.reload(eval(rs));
				document.getElementById("Grid_RelatedDoc").value = Grid_RelatedDocObj.toArrayString();
				document.getElementById("HdnTextbox_RelatedDoc").value = Grid_RelatedDocObj.toArrayString();
			}
			
			if(document.getElementById("HdnTextbox_AlRelatedDoc").value==""){
				var sql2 = "select CM.OID, Doc_Rel.docNo, Doc_Rel.docName, Doc.displayVersion " + "from CustDoc_RelatedDoc Doc_Rel " + "left join ISODocCmItem CM on CM.id = Doc_Rel.docNo " + "left join Documents Doc on Doc.containerOID = CM.OID " + "where Doc_Rel.Related_docNo = '" + document.getElementById("Textbox_DocNo").value + "' " + "and Doc.docStatus = 'RELEASED' order by Doc_Rel.docNo asc ";
				var rs2 = tEFGPConn.query(sql2);
				if (rs2.length > 0) {
					//被關聯文件
					//rs2 = eval(document.getElementById("HdnTextbox_AlRelatedDoc").value);
					var tHdnAlRelatedDocData = "";
					for (var i = 0; i < rs2.length; i++) {
						tHdnAlRelatedDocData = tHdnAlRelatedDocData + "['" + rs2[i][0] + "','" + rs2[i][1] + "','" + rs2[i][2] + "','" + rs2[i][3] + "','',''],";
					}
					tHdnAlRelatedDocData = "[" + tHdnAlRelatedDocData.substring(0, tHdnAlRelatedDocData.length - 1) + "]";
					//rs2 = tHdnAlRelatedDocData;
					Grid_AlRelatedDocObj.reload(eval(tHdnAlRelatedDocData));
					document.getElementById("Grid_AlRelatedDoc").value = Grid_AlRelatedDocObj.toArrayString();
					document.getElementById("HdnTextbox_AlRelatedDoc").value = Grid_AlRelatedDocObj.toArrayString();
				}
			}else{
				var rs2 = eval(document.getElementById("HdnTextbox_AlRelatedDoc").value);
				var tHdnAlRelatedDocData = "";
				for (var i = 0; i < rs2.length; i++) {
					tHdnAlRelatedDocData = tHdnAlRelatedDocData + "['" + rs2[i][0] + "','" + rs2[i][1] + "','" + rs2[i][2] + "','" + rs2[i][3] + "','"+rs2[i][4]+"','"+rs2[i][5]+"'],";
				}
				tHdnAlRelatedDocData = "[" + tHdnAlRelatedDocData.substring(0, tHdnAlRelatedDocData.length - 1) + "]";
				rs2 = tHdnAlRelatedDocData;
				Grid_AlRelatedDocObj.reload(eval(rs2));
				document.getElementById("Grid_AlRelatedDoc").value = Grid_AlRelatedDocObj.toArrayString();
				document.getElementById("HdnTextbox_AlRelatedDoc").value = Grid_AlRelatedDocObj.toArrayString();
			}
			
		}
		
		

		

		//活動關卡代號ISODocManager允許編輯
		if (activityId == "ISODocManager") {
			//document.getElementById("rdoIsNeed_0").disabled = false;
			document.getElementById("rdoAddQC_0").disabled = false;
			//document.getElementById("rdoIsNeed_1").disabled = false;
			document.getElementById("rdoAddQC_1").disabled = false;
			document.getElementById("Dropdown_QCUnits").disabled = false;
			//document.getElementById("txaUnNessResason").readOnly = false;
			document.getElementById("btnAddQC").disabled = false;
			document.getElementById("btnCAR_SBU").style.display="none";
			document.getElementById("btnPCB_SBU").style.display = "none";
		} else {
			
			if (document.getElementById("hdnPrice").value == "PCB" || document.getElementById("hdnPrice").value == "Group") {
				document.getElementById("btnPCB_SBU").style.display = "";
				document.getElementById("btnCAR_SBU").style.display = "none";
			} else if (document.getElementById("hdnPrice").value == "Carrier") {
				document.getElementById("btnPCB_SBU").style.display = "none";
				document.getElementById("btnCAR_SBU").style.display = "";
			} else {
				document.getElementById("btnPCB_SBU").style.display = "none";
				document.getElementById("btnCAR_SBU").style.display = "none";
			}
		
		
			//document.getElementById("rdoIsNeed_0").disabled = true;
			document.getElementById("rdoAddQC_0").disabled = true;
			//document.getElementById("rdoIsNeed_1").disabled = true;
			document.getElementById("rdoAddQC_1").disabled = true;
			document.getElementById("Dropdown_QCUnits").disabled = true;
			//document.getElementById("txaUnNessResason").readOnly = true;
			document.getElementById("btnAddQC").disabled = true;
			
			//品管加簽
			
			if(activityId == "ModISODocManager" && (thdnPrice.value == "PCB" || thdnPrice.value == "Group")){
				document.getElementById("rdoAddQC_0").disabled = false;
				document.getElementById("rdoAddQC_1").disabled = false;
				document.getElementById("Dropdown_QCUnits").disabled = true;
				document.getElementById("btnAddQC").disabled = true;
			}else if(activityId == "ModDocRequester" && thdnPrice.value == "Carrier"){
				document.getElementById("rdoAddQC_0").disabled = false;
				document.getElementById("rdoAddQC_1").disabled = false;
				document.getElementById("Dropdown_QCUnits").disabled = true;
				document.getElementById("btnAddQC").disabled = true;
			}else{
				document.getElementById("rdoAddQC_0").disabled = true;
				document.getElementById("rdoAddQC_1").disabled = true;
				document.getElementById("Dropdown_QCUnits").disabled = true;
				document.getElementById("btnAddQC").disabled = true;
			}
			
		}
	} else {
		document.getElementById("txtECNNo").readOnly = true;
		document.getElementById("txtApplyDate").readOnly = true;
		document.getElementById("txtAbortDate").readOnly = true;
		document.getElementById("Date_ConserveDate_btn").disabled = true;
		document.getElementById("Date_EffectDate_btn").disabled = true;
		//
		document.getElementById("Dropdown_FrameUnits").disabled = true;
		document.getElementById("Textbox_FrameUnitNo").readOnly = true;
		document.getElementById("Textbox_FrameUnitName").readOnly = true;
		document.getElementById("Button_FrameUnit").disabled = true;
		document.getElementById("Dropdown_KeepingUnits").disabled = true;
		document.getElementById("Textbox_KeepingUnitNo").readOnly = true;
		document.getElementById("Textbox_KeepingUnitName").readOnly = true;
		document.getElementById("Button_KeepingUnit").disabled = true;
		document.getElementById("Date_SetDate_btn").disabled = true;
		document.getElementById("Textbox_DocName").readOnly = true;
		document.getElementById("Textbox_VerNoOld").readOnly = true;
		document.getElementById("rdoIsVersionAutoGen").disabled = true;
		document.getElementById("Textbox_CustomVersion").disabled = true;
		

		if (activityId == "Requester") {
			document.getElementById("ddlPrice").disabled = false;
		} else {
			document.getElementById("ddlPrice").disabled = true;
		}
	}
	
	//ISO附件Grid及按鈕隱藏
	if (activityId != "Requester" && activityId != "Applier" && activityId != "RequesterManager" && activityId != "ModDocRequester") {
		var tGridId3 = Grid_ISOFilesObj.getId();
		var tGridElement3 = document.getElementById(tGridId3);
		tGridElement3.style.display = "none";
		if (activityId == "Requester") {
			document.getElementById("btnOpenISOFiles").disabled = true;
		} else {
			var sql = "select Users.id from Users where Users.id in " + "(select Users.id from Users " + "left join Group_User GU on GU.UserOID = Users.OID " + "left join Groups G on G.OID = GU.GroupOID " + "where G.id = 'ISOFiles') and Users.id ='" + userId + "'";
			var rs = tEFGPConn.query(sql);
			if (rs.length > 0) {
				//alert("1");
				document.getElementById("btnOpenISOFiles").disabled = true;
				if(document.getElementById("Attachment_shell")!=null){
					document.getElementById("Attachment_shell").style.display="";
				}
				
			} else {
				//alert("2");
				document.getElementById("btnOpenISOFiles").disabled = false;
				if(document.getElementById("Attachment_shell")!=null){
					document.getElementById("Attachment_shell").style.display="none";
				}
			}
		}
	}
	
	//20160321 mod By Hsieh ISO附件 於 ModDocRequester 時無須判斷是否有加入群組 直接顯示附件
	if(activityId == "ModDocRequester"){
		document.getElementById("btnOpenISOFiles").disabled = true;
		var tGridId = Grid_ISOFilesObj.getId();
		var tGridElement = document.getElementById(tGridId);
		tGridElement.style.display = "none";
		if(document.getElementById("Attachment_shell")!=null){
			document.getElementById("Attachment_shell").style.display="";
		}			
	}
	
	//判断表单存储时ApplyTime栏位的值
	formSaveApplyTime();

	//20160319 Add by Bryan 文件製作者關卡時自動清空失效日期由DCC重新定義
	//20160322 Add by Bryan 文件製作者關卡時自動清空前一版本審查週期相關欄位
	if(activityId == 'ModDocRequester'){
		//if(document.getElementById("Date_DeadDate_txt").value <= systemDateTime){
			document.getElementById("Date_DeadDate_txt").value = '';
			document.getElementById("Date_ConserveDate_txt").value = '';
			document.getElementById("hdnReviewCycleName").value = '';
			document.getElementById("hdnReCycleMonth").value = '';
		//}
	}
	
	if(activityId == "ISODocManagerConfirm" || activityId == "ISODocManagerConfirm2" || activityId == "ModISODocManager"){
		document.getElementById("Attachment").disabled = false;
	}

	// 2016-03-25 Jason Zhou Added
	if(document.getElementById('TextArea_Modreason').value != '') {
		// alert('reload TextArea_Modreason');
		document.getElementById('TextArea_Modreason').value = document.getElementById('TextArea_Modreason').value.replace(new RegExp("<#quot>", "gm"),"\'").replace(new RegExp("<br />", "gm")," ").replace(new RegExp("<#leftQuot>", "gm"),"\[").replace(new RegExp("<#rightQuot>", "gm"),"\]").replace(new RegExp("<#slash>", "gm"),"\\");
	} 
	if(document.getElementById('hdnDCCGroups').value != '') {
		document.getElementById('hdnDCCGroups').value = document.getElementById('hdnDCCGroups').value.replace(new RegExp("<#quot>", "gm"),"\'").replace(new RegExp("<br />", "gm")," ").replace(new RegExp("<#leftQuot>", "gm"),"\[").replace(new RegExp("<#rightQuot>", "gm"),"\]").replace(new RegExp("<#slash>", "gm"),"\\");
	}
	if(document.getElementById('HdnTextbox_DocOID').value != '') {
		document.getElementById('HdnTextbox_DocOID').value = document.getElementById('HdnTextbox_DocOID').value.replace(new RegExp("<#quot>", "gm"),"\'").replace(new RegExp("<br />", "gm")," ").replace(new RegExp("<#leftQuot>", "gm"),"\[").replace(new RegExp("<#rightQuot>", "gm"),"\]").replace(new RegExp("<#slash>", "gm"),"\\");
	}
	
	return true;
}

function getAllPowerLevel() {
	ajax_IsoModuleAccessor.getAllSecurityLevelForOpenWin(loadAllPowerLevel);
}

function loadAllPowerLevel(data) {
	for (var i = 0; i < data.length; i++) {
		allPowerLevel = allPowerLevel + "['" + data[i].OID + "','" + data[i].name + "'],";
	}
	allPowerLevel = "[" + allPowerLevel.substring(0, allPowerLevel.length - 1) + "]";
	queryList(eval(allPowerLevel), "Dropdown_PowerLevel");
	document.getElementById("Dropdown_PowerLevel").value = document.getElementById("Hdn_PowerLevel").value;
}

function getAllAccessRights() {
	ajax_IsoModuleAccessor.getAllAccessRightForOpenWin(loadAllAccessRights);
}

function loadAllAccessRights(data) {
	for (var i = 0; i < data.length; i++) {
		allPowerFrom = allPowerFrom + "['" + data[i].OID + "','" + data[i].name + "'],";
	}
	allPowerFrom = "[" + allPowerFrom.substring(0, allPowerFrom.length - 1) + "]";
	queryList(eval(allPowerFrom), "Dropdown_PowerFrom");
}

function reloadGrids() {
	//重新載入Grid資訊
	gISOTypeData = document.getElementById("Grid_ISOType").value;
	if (gISOTypeData.length > 1 && typeof(Grid_ISOTypeObj) != "undefined") {
		Grid_ISOTypeObj.reload(eval(gISOTypeData));
	}

	gDocCategoryData = document.getElementById("Grid_DocCategory").value;
	if (gDocCategoryData.length > 1 && typeof(Grid_DocCategoryObj) != "undefined") {
		Grid_DocCategoryObj.reload(eval(gDocCategoryData));
	}
	gDocServerData = document.getElementById("Grid_DocServer").value;
	if (gDocServerData.length > 1 && typeof(Grid_DocServerObj) != "undefined") {
		Grid_DocServerObj.reload(eval(gDocServerData));
	}
	gReferDocData = document.getElementById("Grid_ReferDoc").value;
	if (gReferDocData.length > 1 && typeof(Grid_ReferDocObj) != "undefined") {
		Grid_ReferDocObj.reload(eval(gReferDocData));
	}
	gIssueUnitData = document.getElementById("Grid_IssueUnit").value;
	if (gIssueUnitData.length > 1 && typeof(Grid_IssueUnitObj) != "undefined") {
		Grid_IssueUnitObj.reload(eval(gIssueUnitData));
	}
	gRelateUnitData = document.getElementById("Grid_RelateUnit").value;
	if (gRelateUnitData.length > 1 && typeof(Grid_RelateUnitObj) != "undefined") {
		Grid_RelateUnitObj.reload(eval(gRelateUnitData));
	}
	
	gRelateUnitData = document.getElementById("Grid_RelateUnit_EFGP").value;
	if (gRelateUnitData.length > 1 && typeof(Grid_RelateUnit_EFGPObj) != "undefined") {
		Grid_RelateUnit_EFGPObj.reload(eval(gRelateUnitData));
	}
	
	gPowerData = document.getElementById("Grid_Power").value;
	if (gPowerData.length > 1 && typeof(Grid_PowerObj) != "undefined") {
		Grid_PowerObj.reload(eval(gPowerData));
	}

	gClauseData = document.getElementById("Grid_ISOClause").value;
	if (gClauseData.length > 1 && typeof(Grid_ISOClauseObj) != "undefined") {
		Grid_ISOClauseObj.reload(eval(gClauseData));
	}
	//20160112 add by Hsieh 關聯文件 被關聯文件
	gRelatedDocData = document.getElementById("Grid_RelatedDoc").value;
	if (gRelatedDocData.length > 1 && typeof(Grid_RelatedDocObj) != "undefined") {
		Grid_RelatedDocObj.reload(eval(gRelatedDocData));
	}
	
	gAlRelatedDocData = document.getElementById("Grid_AlRelatedDoc").value;
	if (gAlRelatedDocData.length > 1 && typeof(Grid_AlRelatedDocObj) != "undefined") {
		Grid_AlRelatedDocObj.reload(eval(gAlRelatedDocData));
	}
	
	//上階文件
	gUpperDocData = document.getElementById("Grid_UpperDoc").value;
	if (gUpperDocData.length > 1) {
		if (typeof(Grid_UpperDocObj) != "undefined") {
			Grid_UpperDocObj.reload(eval(gUpperDocData));
		}
	}

	//下階文件
	gLowerDocData = document.getElementById("Grid_LowerDoc").value;
	if (gLowerDocData.length > 1) {
		if (typeof(Grid_LowerDocObj) != "undefined") {
			Grid_LowerDocObj.reload(eval(gLowerDocData));
		}
	}

	//20130102 Tiffany 附件政策
	// gFilePolicyData= document.getElementById("Grid_FilePolicy").value;
	// if(gFilePolicyData.length >1){
	// 	if(typeof(Grid_FilePolicyObj) != "undefined"){
	// 		Grid_FilePolicyObj.reload(eval(gFilePolicyData));
	// 	}
	// }
}

function checkData() {

	if (! (checkFinish("Textbox_DocName", "文件名稱", "", "")) || !(checkFinish("Textbox_FrameUnitNo", "制定單位", "", "")) || !(checkFinish("Textbox_KeepingUnitNo", "保管單位", "", ""))
	//||!(checkFinish("Textbox_ReadTime","可閱讀時數","",""))
	//||!(checkFinish("Textbox_ConserveYear","保存年限","",""))
	//||!(checkFinish("Date_ConserveDate_txt","保存到期日","",""))
	//||!(checkFinish("TextArea_DocAbstract","流程送審描述","",""))
	) {
		return false;
	}

	//新增審閱相關資訊  SINCE : NANA5.5.2 MODI BY 4182 IN 20130218 START
	if (document.getElementById("txtVettingNoticeDay").value != "") {
		var intValue = parseInt(document.getElementById("txtVettingNoticeDay").value, 10);
		if (isNaN(intValue)) {
			alert('評審通知日必需為數值');
			return false;
		} else {
			document.getElementById("txtVettingNoticeDay").value = intValue;
		}
	}

	if (document.getElementById("txtPeriod").value != "") {
		var intValue = parseInt(document.getElementById("txtPeriod").value, 10);
		if (isNaN(intValue)) {
			alert('評審期間必需為數值');
			return false;
		} else {
			document.getElementById("txtPeriod").value = intValue;
		}
	}
	if (document.getElementById("txtPeriod").value == "") document.getElementById("txtPeriod").value = 0;
	if (document.getElementById("txtPeriod").value > 0 && document.getElementById("hdnVettingUnitOID").value == "") {
		alert('評審部門必填');
		return false;
	}

	if ((document.getElementById("txtPeriod").value == "" || document.getElementById("txtPeriod").value == "0") && document.getElementById("hdnVettingUnitOID").value != "") {
		alert('評審期間必填');
		return false;
	}
	//新增審閱相關資訊  SINCE : NANA5.5.2 MODI BY 4182 IN 20130218 END
	if (activityId == "ISODocManager") {
		if (! (checkFinish("Dropdown_PowerLevel", "此文件機密等級", "", "")) || !(checkFinish("Dropdown_PowerLevel", "此文件機密等級", "0", "")) || !(checkFinish("HdnTextbox_DocServer", "文件伺服器", "", "Btn_DocServerAdd"))) {
			return false;
		}

		gPowerData = document.getElementById("Grid_Power").value;
		if (gPowerData.length == 0) {
			alert("請填寫權限群組");
			return false;
		}
	}
	if (activityId == "ModDocRequester" || activityId == "ModISODocManager") {

		//判斷選取的條文是否為文件型態的所屬條文
		if (document.getElementById("HdnTextbox_ISOClause").value != "") {
			var tDocLevelsArry = eval(document.getElementById("HdnTextbox_ISOType").value);
			var tHdnData = eval(document.getElementById("HdnTextbox_ISOClause").value);
			var tClauseOID = "";
			for (var i = 0; i < tHdnData.length; i++) {
				tClauseOID = tClauseOID + tHdnData[i][0] + ",";
			}
			var tDocTypeOID = "";
			for (var i = 0; i < tDocLevelsArry.length; i++) {
				if (tDocTypeOID.indexOf(tDocLevelsArry[i][2]) < 0) {
					tDocTypeOID = tDocTypeOID + "'" + tDocLevelsArry[i][2] + "',";
				}
			}
			tDocTypeOID = tDocTypeOID.substring(0, tDocTypeOID.length - 1);
			tClauseOID = tClauseOID.substring(0, tClauseOID.length - 1);
			DWREngine.setAsync(false);
			ajax_IsoModuleAccessor.checkIsoClause(tDocTypeOID, tClauseOID, loadCheckIsoClause);
		}
	}

	//檢查上階是否合法(上階文件不可為本身文件的子階文件)
	var upperDocOIDs = "";
	var upperVers = "";
	var upperIds = "";

	if (document.getElementById("Grid_UpperDoc").value.length > 2) {

		var tGridArray = eval(document.getElementById("Grid_UpperDoc").value);

		if (typeof(tGridArray) != "undefined") {
			for (i = 0; i < tGridArray.length; i++) {
				upperDocOIDs = upperDocOIDs + tGridArray[i][4] + ",";
				upperVers = upperVers + tGridArray[i][5] + ",";
				upperIds = upperIds + tGridArray[i][1] + ",";
			}
		}

		var docOID = eval(document.getElementById("HdnTextbox_DocOID").value);
		if (upperDocOIDs != "") {
			DWREngine.setAsync(false);
			ajax_IsoModuleAccessor.checkUpperDocRule(upperDocOIDs, upperIds, upperVers, docOID[0][4], loadCheckUpperDocRule);
		}

		//上階文件不可為主文件
		if (document.getElementById("Grid_UpperDoc").value.length > 2) {
			var docOID = eval(document.getElementById("HdnTextbox_DocOID").value);
			if (typeof(tGridArray) != "undefined") {
				for (i = 0; i < tGridArray.length; i++) {
					if (tGridArray[i][4] == docOID[0][4]) {
						alert("上階文件不可為主文件(目前變更的文件)!");
						return false;
					}
				}
			}

		}

	}

	return returnValue;
}
//判斷選取的上階文件是否合法
function loadCheckUpperDocRule(data) {
	returnValue = true;
	if (data != "") {
		alert(data + '為不合法的上階文件,該文件為本身文件的子階文件!');
		returnValue = false;
	}
	return returnValue;
}

//判斷選取的條文是否為文件型態的所屬條文
function loadCheckIsoClause(data) {
	returnValue = true;
	if (data != "") {
		alert("您選取的條文非指定文件型態內的所屬條文:" + data);
		returnValue = false;
	}
	return returnValue;
}

function formSave() {
	
	//卡控工作日期不得為空值
	if (activityId == "Requester") {
		//saveAbortDate();
		if (document.getElementById("txtAbortDate").value == ""){
			alert("申請人尚未設定工作行事曆，請聯繫資訊部相關人員處理");
			return false;
		} 
		
	}
	
	
	if (activityId == "Requester") {
		if (! (checkFinish("Textbox_DocNo", "文件編號", "", "")) || !(checkFinish("TextArea_Modreason", "變更原因", "", ""))
		//||!(checkFinish("Textbox_ReadTime","文件基本資料","","Button_ChooseNo"))
		) {
			return false;
		}
	}
	
	
	document.getElementById("Grid_DocCategory").value = Grid_DocCategoryObj.toArrayString();
	
	if (activityId == "Requester" || activityId == "Applier" || activityId == "RequesterManager"){
		var tGridId = Grid_DocCategoryObj.getId();
		var tGridElement = document.getElementById(tGridId);
		tGridElement.style.display = "none";
	}else{
		var tGridId = Grid_DocCategoryObj.getId();
		var tGridElement = document.getElementById(tGridId);
		tGridElement.style.display = "";
		
	}
	
	
	
	
	if (activityId == "ModDocRequester" || activityId == "ModISODocManager") {

		//確認各欄位有填入資料
		if (!checkData()) {
			return false;
		}

		//確認填入資料為數值
		/*     if(document.getElementById("Textbox_ConserveYear").value!=""){
		  if(!checkIfNum("Textbox_ConserveYear","保存年限")){
			return false;
		  }
		} */

		if (document.getElementById("rdoIsVersionAutoGen_1").checked) {

			if (!checkFinish("Textbox_CustomVersion", "文件版號", "", "")) {
				return false;
			}

			//檢查自訂文件版號是否可以用使用
			if (!checkEnableDispatch()) {
				return false;
			}

		} else {
			document.getElementById("Textbox_CustomVersion").value = "";
		}

		var deadDate = document.getElementById("Date_DeadDate_txt").value;
		var conserveDate = document.getElementById("Date_ConserveDate_txt").value;
		if (deadDate != "" && conserveDate != "") {
			if (deadDate > conserveDate) {
				alert("失效日期不可晚於保存到期日期");
				return false;
			}
		}

		//儲存Grid 資料
		document.getElementById("Grid_ISOType").value = Grid_ISOTypeObj.toArrayString();
		document.getElementById("Grid_DocCategory").value = Grid_DocCategoryObj.toArrayString();
		document.getElementById("Grid_DocServer").value = Grid_DocServerObj.toArrayString();
		document.getElementById("Grid_ReferDoc").value = Grid_ReferDocObj.toArrayString();
		document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
		document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();
		var tGridId = Grid_RelateUnitObj.getId();
		var tGridElement = document.getElementById(tGridId);
		tGridElement.style.display = "none";
		
		document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString();
		//alert(document.getElementById("Grid_RelateUnit_EFGP").value);
		document.getElementById("Grid_Power").value = Grid_PowerObj.toArrayString();
		document.getElementById("Grid_ISOClause").value = Grid_ISOClauseObj.toArrayString();
		document.getElementById("Grid_RelatedDoc").value = Grid_RelatedDocObj.toArrayString();
		document.getElementById("Grid_AlRelatedDoc").value = Grid_AlRelatedDocObj.toArrayString();
		var tData=Grid_RelateUnit_EFGPObj.getData();
		//alert(tData.length);
		if(tData.length==0){
			alert("請寫會簽單位資訊!");
			return false;
		
		}
		
		//20130102 Tiffany 附件政策
		//document.getElementById("Grid_FilePolicy").value = Grid_FilePolicyObj.toArrayString();
		//紀錄發行單位
		gIssueUnitData = Grid_IssueUnitObj.getData();
		var issueUnits = "";
		if (gIssueUnitData.length > 0) {
			for (i = 0; i < gIssueUnitData.length; i++) {
				if (gIssueUnitData[i][6] != "") {
					issueUnits = issueUnits + gIssueUnitData[i][6];
				}
			}
		}
		document.getElementById("HdnTextbox_Issue").value = issueUnits;
		//alert("HdnTextbox_Issue="+document.getElementById("HdnTextbox_Issue").value);
		//紀錄會簽單位的參與者(不含子部門)
		gRelateUnitData = Grid_RelateUnitObj.getData();
		var relateUnits = "";
		if (gRelateUnitData.length > 0) {
			for (i = 0; i < gRelateUnitData.length; i++) {
				if (gRelateUnitData[i][4] != "") {
					relateUnits = relateUnits + gRelateUnitData[i][4];
				}
			}
		}
		document.getElementById("HdnTextbox_RelatedDep").value = document.getElementById("HdnTextbox_RelatedDep").value + relateUnits;
	}
	//紙本用..抓文件最後一個版號..start--/
	if (activityId == "ModDocRequester" || activityId == "ISODocManagerConfirm" || activityId == "ISODocManagerConfirm2") {
		DWREngine.setAsync(false); //同步化
		//透過最cmItemOID查詢該文件的最後一個版號
		var docOID = eval(document.getElementById("HdnTextbox_DocOID").value);
		ajax_IsoModuleAccessor.getDocumentLastVerByOID(docOID[0][0], dataLastVer);
	}
	//紙本用..抓文件最後一個版號..end--/
	var msg = checkForm();
	if (msg.length > 0) {
		alert(msg);
		return false;
	}

	//存储DCC群组隐藏栏位值
	if (activityId == "RequesterManager" || activityId == "ModDocRequester") {
		saveHdnDCCGroups();
	}

	saveEffectDate();
	
	//20160108 mode by Hsieh 保存到期日於DCC群組確認變更關卡後執行 ISODocManagerConfirm
	if (activityId == "ISODocManagerConfirm" || activityId == "ISODocManagerConfirm2") {
		saveConserveDate();
	}
	
	
	//20160319 add by Hsieh 移除會簽單位 人員 資訊
	if(activityId == "ISODocManagerConfirm" || activityId == "ISODocManagerConfirm2"){
		var tGridId = Grid_RelateUnitObj.getId();
		var tGridElement = document.getElementById(tGridId);
		tGridElement.style.display = "";	
		var tData=Grid_RelateUnitObj.getData();		
		if(tData.length>0){
			var Grid_RelateUnit=[];
			for(var i=0;i<tData.length;i++){
				var Grid_RelateUnit_rec=[];
				if(tData[i][2]!="4"){
					Grid_RelateUnit_rec.push(tData[i][0]);
					Grid_RelateUnit_rec.push(tData[i][1]);
					Grid_RelateUnit_rec.push(tData[i][2]);
					Grid_RelateUnit_rec.push(tData[i][3]);
					Grid_RelateUnit_rec.push(tData[i][4]);
					Grid_RelateUnit.push(Grid_RelateUnit_rec);
				}
				
			}
			Grid_RelateUnitObj.reload(eval(Grid_RelateUnit)); 
			document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();
		
			var tGridId = Grid_RelateUnitObj.getId();
			var tGridElement = document.getElementById(tGridId);
			tGridElement.style.display = "none";
			//alert(document.getElementById("Grid_RelateUnit").value);
		
		}
	}
	

	//20160319 Add by Bryan 文件製作者關卡時自動清空失效日期由DCC重新定義
	//20160322 Add by Bryan 文件製作者關卡時自動清空前一版本審查週期相關欄位	
	if(activityId == 'ModDocRequester'){
		//if(document.getElementById("Date_DeadDate_txt").value <= systemDateTime){
			document.getElementById("Date_DeadDate_txt").value = "";
			document.getElementById("Date_ConserveDate_txt").value = "";
			document.getElementById("hdnReviewCycleName").value = "";
			document.getElementById("hdnReCycleMonth").value = "";
		//}
	}
	
	//txaFinalManager_txt.value = '00791;';
	
	//20160322 Add by Bryan 檢查表單是否必填
	if(!formCheck()){
		return false;
	}
	
	return true;
}

/*
 *紙本用..先取得該文件的最後一個版號再塞到session去
 */
function dataLastVer(data) {
	//將文件ID,文件名稱,文件版號放入session,紙本申請會用到
	ajax_IsoModuleAccessor.setISOPaperSession(serialNumber, document.getElementById("Textbox_DocNo").value, document.getElementById("Textbox_DocName").value, data);

}

function formClose() {
	return true;
}

//更新系統當下日期
function formSaveApplyTime() {
	if (activityId == "Requester" && (workItemSource == 0 || workItemSource != "")) {
		tApplyDate.value = systemDateTime;
	}
}

//存储DCC群组隐藏栏位值
function saveHdnDCCGroups() {
	var tGridData = "";
	var tGridDataRec = Grid_DocCategoryObj.getData();
	if (tGridDataRec.length > 0) {
		for (var i = 0; i < tGridDataRec.length; i++) {
			tGridData += tGridDataRec[i][0] + ";";
		}
	}
	tGridData = tGridData.substring(0, tGridData.length - 1);
	DWREngine.setAsync(false);
	ajax_get2ndCategoryOID.get2ndCategorybyOID(tGridData, loadQuery);
	DWREngine.setAsync(true);
}

function loadQuery(data) {
	if (data != "") {
		thdnDCCGroups.value = data;
	}
}

function checkForm() {
	var msg = "";
	if (tddlPrice.value == "$$$$$$") {
		msg += "請選擇事業別!\n";
	}
	if (checkRadioValue() == false) {
		msg += "自定義文件版號不可為空!\n";
	}
	if (document.getElementById("txtAbortDate").value == "") {
		msg += "申請人尚未設定工作行事曆，\n請聯繫資訊部相關人員處理!\n";
	}
	if (activityId == "ModDocRequester") {
		var sql = "select id, userName, leaveDate from Users where id = '" + document.getElementById("InputLabel_Author_txt").value + "'";
		var rs = tEFGPConn.query(sql);
		if (rs.length > 0) {
			if (rs[0][2] != "") {
				var leaveDate = rs[0][2];
				var TodayDate = systemDateTime;
				leaveDate = leaveDate.substr(0, 10);
				leaveDate.replace("-", "");
				TodayDate.replace("/", "");
				if (Number(leaveDate) <= Number(TodayDate)) msg += "此文件編號之文件製作者已經離職，\n請通知DCC相關人員！";
			}
		}
	}
	/*
	if ((activityId == "ISODocManager" || activityId == "ModISODocManager" || activityId == "ISODocManagerConfirm") && thdnPrice.value == "PCB" && document.getElementById("HdnTextbox_DocCategory").value == "臨時性作業規範" && document.getElementById('Date_DeadDate_txt').value == "") {
		msg += "失效日期不可為空!\n";
	}
	*/
	
	if ((activityId == "ModISODocManager" || activityId == "ISODocManagerConfirm") && thdnPrice.value == "PCB") {
		var tFlag = 0;
		var tGridData = Grid_DocCategoryObj.getData();
		
		if (tGridData.length > 0) {
			for (var i = 0; i < tGridData.length; i++) {
			alert("index : "+tGridData[i][1].indexOf("1-表單/點檢表"));
				if (tGridData[i][1].indexOf("1-表單/點檢表") == -1 || tGridData[i][1].indexOf("2-規範/辦法") == -1) {
					tFlag++;
				}
			}
		}
		if (tFlag > 0 && document.getElementById("Date_DeadDate_txt").value == "") {
			msg += "失效日期不可為空!\n";
		}
		if(activityId == "ModISODocManager"){
			if(tFlag > 0 && (!trdoAddQC_0.checked) && (!trdoAddQC_1.checked)){
				msg += "請選擇是否需要加簽品管窗口!\n";
			}
		}
		
	}
	
	
	if (activityId == "ModISODocManager" || activityId == "ISODocManagerConfirm" || activityId == "ISODocManagerConfirm2") {
		var tHdnRadioValue = document.getElementById("Checkbox_IsConvertPDF_hdn").value;
		// var tRadioButton=document.getElementsByName("Checkbox_IsConvertPDF");
		// var tSelectedValue="";
		// for(var i=0;i<tRadioButton.length;i++){
		// 	if(tRadioButton[i].checked){
		// 		tSelectedValue=tRadioButton[i].text;
		// 	}
		// }
		if (tHdnRadioValue == "") {
			msg += "請選擇是否轉檔!\n";
		} else if (tHdnRadioValue == "true") {
			var tRadioButton2 = document.getElementsByName("PDFFileSecurity");
			var tSelectedValue2 = "";
			for (var i = 0; i < tRadioButton2.length; i++) {
				if (tRadioButton2[i].checked) {
					tSelectedValue2 = tRadioButton2[i].text;
				}
			}
			if (tSelectedValue2 == "") {
				msg += "請選擇文件轉檔後之安全性!\n";
			}
		}
	}
	if (activityId == "ModDocRequester") {
		var Grid_RelatedDocData = Grid_RelatedDocObj.getData();
		var tIsChange="Y";
		var tIsChoseModNo="Y";
		if (Grid_RelatedDocData.length > 0) {
			
			for (var i = 0; i < Grid_RelatedDocData.length; i++) {
				if (Grid_RelatedDocData[i][4] == "") {
					tIsChange="N";
					
				} else if (Grid_RelatedDocData[i][4] == "Y") {
					if (Grid_RelatedDocData[i][5] == "") {
						tIsChoseModNo="N";
						
					}
				}
			}
			
		}
		var Grid_AlRelatedDocData = Grid_AlRelatedDocObj.getData();
		if (Grid_AlRelatedDocData.length > 0) {
			for (var i = 0; i < Grid_AlRelatedDocData.length; i++) {
				if (Grid_AlRelatedDocData[i][4] == "") {
					tIsChange="N";
				} else if (Grid_AlRelatedDocData[i][4] == "Y") {
					if (Grid_AlRelatedDocData[i][5] == "") {
						tIsChoseModNo="N";
					}
				}
			}
		}
		if(tIsChange=="N"){
			msg += "請確認關聯文件是否需要變更!\n";
		}
		if(tIsChoseModNo=="N"){
			msg += "如需變更請選擇對應變更單號!\n";
		}
		
		//品管加簽窗口
		if(thdnPrice.value == "Carrier"){
			var trdoAddQC_0 = document.getElementById("rdoAddQC_0");
			var trdoAddQC_1 = document.getElementById("rdoAddQC_1");
			if((!trdoAddQC_0.checked) && (!trdoAddQC_1.checked)){
				msg += "請選擇是否需要加簽品管窗口!\n";
			}
			if((trdoAddQC_1.checked && document.getElementById("txtAddQC").value=="")){
				msg += "請選擇加簽品管窗口！\n";
			}
		}
		
		
		
		
	}
	//工程變更單區塊
	if (activityId == "ModDocRequester") {
		//var tRadioButton = document.getElementsByName("rdoIsNeed");
		//var checked = 0;
		var trdoIsNeed_0 = document.getElementById("rdoIsNeed_0");
		var trdoIsNeed_1 = document.getElementById("rdoIsNeed_1");
		if (trdoIsNeed_1.checked) {
			//checked = 1;
			
			
			//document.getElementById("hdnIsNeed").value = trdoIsNeed_1.value;
			if (document.getElementById("hdnIsNeed").value == "N" && document.getElementById("txaUnNessResason").value == "") {
				msg += "請詳述不需要變更ECN/ECR工程變更單之理由！\n";
			}
			
		}
		if ((!trdoIsNeed_0.checked) && (!trdoIsNeed_1.checked)) {
			msg += "請選擇是否需要變更ECN工程變更單!\n";
		}
		if (trdoIsNeed_0.checked) {
			if (document.getElementById("txtECNNo").value == "") {
				msg += "請選擇需要變更ECN/ECR工程變更單！\n";
			}
			
		}
		
		/* 20160321 mod By Hsieh 此段邏輯 改於 ModISODocManager 卡控
		if (thdnPrice.value == "PCB") {
			var tFlag = 0;
			var tGridData = Grid_DocCategoryObj.getData();
			if (tGridData.length > 0) {
				for (var i = 0; i < tGridData.length; i++) {
					if (tGridData[i][1].indexOf("1-表單/點檢表") != -1 || tGridData[i][1].indexOf("2-規範/辦法") != -1) {
						tFlag++;
					}
				}
			}
			if (tFlag > 0) {
				var tRadioButton = document.getElementsByName("rdoAddQC");
				checked = 0;
				for (var i = 0; i < tRadioButton.length; i++) {
					if (tRadioButton[i].checked) {
						checked = 1;
						document.getElementById("hdnAddQC").value = tRadioButton[i].value;
						if (document.getElementById("hdnAddQC").value == "Y" && document.getElementById("txtAddQC").value == "") {
							msg += ("請選擇加簽品管窗口！\n");
						}
					}
				}
				if (checked == 0) {
					msg += ("請選擇是否需要加簽品管窗口!\n");
				}
			}
		}
		*/
		
	}
	
	//20160321 mod By Hsieh ModISODocManager
	if(activityId =="ModISODocManager"){
		//thdnPrice.value == "PCB";
		if (thdnPrice.value == "PCB") {
			var tFlag = 0;
			var tGridData = Grid_DocCategoryObj.getData();
			if (tGridData.length > 0) {
				for (var i = 0; i < tGridData.length; i++) {
					if (tGridData[i][1].indexOf("1-表單/點檢表") != -1 || tGridData[i][1].indexOf("2-規範/辦法") != -1) {
						tFlag++;
					}
				}
			}
			var trdoAddQC_0 = document.getElementById("rdoAddQC_0");
			var trdoAddQC_1 = document.getElementById("rdoAddQC_1");
			if (tFlag > 0) {
				
				var checked = 0;
				
				if (trdoAddQC_1.checked) {
					checked = 1;
					//document.getElementById("hdnAddQC").value = trdoAddQC_0.value;
					if (document.getElementById("hdnAddQC").value == "Y" && document.getElementById("txtAddQC").value == "") {
						msg += "請選擇加簽品管窗口！\n";
					}
				}
				if (checked == 0) {
					msg += "請選擇是否需要加簽品管窗口!\n";
				}
			}
			if(trdoAddQC_1.checked && document.getElementById("txtAddQC").value == ""){
				msg += "請選擇是否需要加簽品管窗口!\n";
			}
		}
	
	}
	
	return msg;
}

//選擇下拉選項後須將內儲值寫入[表單.hdnPrice]欄位
function ddlPrice_onchange() {
	thdnPrice.value = tddlPrice.value;
	if (activityId != "Requester" && activityId != "Applier" && activityId != "RequesterManager" && activityId != "ISODocManager") {
		if (document.getElementById("hdnPrice").value == "PCB" || document.getElementById("hdnPrice").value == "Group") {		
			document.getElementById("btnPCB_SBU").style.display = "";		
			document.getElementById("btnCAR_SBU").style.display = "none";		
			document.getElementById("btnAddSales").disabled = false;		
		} else if (document.getElementById("hdnPrice").value == "Carrier") {
			document.getElementById("btnPCB_SBU").style.display = "none";
			document.getElementById("btnCAR_SBU").style.display = "";
			document.getElementById("btnAddSales").disabled = true;
		} else {
			document.getElementById("btnPCB_SBU").style.display = "none";
			document.getElementById("btnCAR_SBU").style.display = "none";
			document.getElementById("btnAddSales").disabled = false;
		}
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
	document.getElementById("txtAbortDate").value = data;
}

//如選擇自行定義卡控為必填且不可為空值
function checkRadioValue() {
	var tRadioButton = document.getElementsByName("rdoIsVersionAutoGen_1");
	if (tRadioButton.checked) {
		if (document.getElementById("Textbox_CustomVersion").value == "") {
			return false;
		}
	}
	return true;
}

//當文件製作者欄位資料有變更，制定單位資料也需要一併被更新
function InputLabel_Author_onchange() {
	var sql = "select Unit.OID, Unit.id, Unit.organizationUnitName " + "from Functions, Users, OrganizationUnit Unit " + "where Functions.occupantOID = Users.OID " + "and Functions.organizationUnitOID = Unit.OID " + "and Functions.isMain = 1 and Users.id = '" + document.getElementById("InputLabel_Author_txt").value + "'";
	var rs = tEFGPConn.query(sql);
	if (rs.length > 0) {
		document.getElementById("HdnTextbox_FrameUnit").value = rs[0][0];
		document.getElementById("Textbox_FrameUnitNo").value = rs[0][1];
		document.getElementById("Textbox_FrameUnitName").value = rs[0][2];
	}
}

function saveEffectDate() {
	if (activityId == "ISODocManagerConfirm" || activityId == "ISODocManagerConfirm2") document.getElementById("Date_EffectDate_txt").value = systemDateTime;
}

function saveConserveDate() { 
	if (document.getElementById("Date_EffectDate_txt").value != "" ) { //&& document.getElementById("Date_ConserveDate_txt").value == ""
		document.getElementById("hdnReCycleMonth").value = 0;
		var tGridDataRec = Grid_DocCategoryObj.getData();
		if (tGridDataRec.length > 0) {
			for (var i = 0; i < tGridDataRec.length; i++) {
				var sql = "select OID, nameStack from DocCategory " + "where OID = '" + tGridDataRec[i][0] + "'";
				var rs = tEFGPConn.query(sql);
				if (rs.length > 0) {
					var sql1 = "select nameStack, ReviewCycle, ReviewCycleName from CustISODocDelay " + "where nameStack = '" + rs[0][1] + "'";
					//alert(sql1);
					var rs1 = tEFGPConn.query(sql1);
					if (rs1.length > 0) {
						//alert(rs1[0][2]);
						//alert("nameStack:"+rs1[0][0]+"!!ReviewCycle:"+rs1[0][1]+"!!ReviewCycleName:"+rs1[0][2]);
						if (document.getElementById("hdnReCycleMonth").value == 0 || Number(rs1[0][1]) < Number(document.getElementById("hdnReCycleMonth").value)) {
							document.getElementById("hdnReCycleMonth").value = rs1[0][1];
							document.getElementById("hdnReviewCycleName").value = rs1[0][2];
						}
					}
				}
			}
		}
		var year = document.getElementById("Date_EffectDate_txt").value.substr(0, 4);
		var month = document.getElementById("Date_EffectDate_txt").value.substr(5, 2);
		if(Number(document.getElementById("hdnReCycleMonth").value) != 0) {
			month = Number(month) + Number(document.getElementById("hdnReCycleMonth").value);
			year = Number(year) + parseInt(month / 12);
			month = month % 12;
			(month < 10)? month = "0" + month : month;
		}
		//alert(year + "-" + month);
		document.getElementById("Date_ConserveDate_txt").value = year + "/" + month + "/" + document.getElementById("Date_EffectDate_txt").value.substr(8, 2);
	}
}

//當文件製作者重新選擇文件類別後填Grid_IssueUnit
/* 20160310 mod By Hsieh 改由下面方式撈資料
function afterSaveGrid_IssueUnit() {
	var tGridDataRec = Grid_DocCategoryObj.getData();
	if (tGridDataRec.length > 0) {
		for (var i = 0; i < tGridDataRec.length; i++) {
			var sql = "select distinct ReleaseUnitOID, unitType from CustISODocCate_ReleaseUnits " + "where DocCateOID = '" + tGridDataRec[i][0] + "'";	
			var rs = tEFGPConn.query(sql);
			if (rs.length > 0) {
				DWREngine.setAsync(false);
				for (var j = 0; j < rs.length; j++) {
					if (rs[j][1] == "DEPT") {
						document.getElementById("Dropdown_IssueUnits").value = "1";
						ajax_OrgAccessor.findOrgUnitByOID(rs[j][0], getData_Grid_IssueUnit1);
					} else if (rs[j][1] == "GROUP") {
						document.getElementById("Dropdown_IssueUnits").value = "3";
						ajax_OrgAccessor.findGroupByOID(rs[j][0], getData_Grid_IssueUnit2);
					} else if (rs[j][1] == "USER") {
						document.getElementById("Dropdown_IssueUnits").value = "4";
						ajax_OrgAccessor.findUserByOID(rs[j][0], getData_Grid_IssueUnit3);
					}
				}
			}
		}
	}
}

function getData_Grid_IssueUnit1(data) {
	document.getElementById("HdnTextbox_IssueUnit").value = data.OID;
	document.getElementById("Textbox_IssueUnitNo").value = data.id;
	document.getElementById("Textbox_IssueUnitName").value = data.name;
	var sql1 = "select distinct RoleDef.OID, Org.organizationName, RoleDef.roleDefinitionName " + "from Role, Organization Org, RoleDefinition RoleDef " + "where Role.definitionOID = RoleDef.OID " + "and RoleDef.organizationOID = Org.OID";
	var rs1 = tEFGPConn.query(sql1);
	if (rs1.length > 0) {
		document.getElementById("HdnTextbox_RoleOID").value = rs1[0][0];
		document.getElementById("Textbox_RoleName").value = rs1[0][1] + "_" + rs1[0][2];
	}
	var sql2 = "select U.id from Users U, OrganizationUnit O where O.managerOID = U.OID and O.OID = '" + data.OID + "'";
	var rs2 = tEFGPConn.query(sql2);
	if (rs2.length > 0) {
		document.getElementById("HdnTextbox_Person").value = rs2[0][0] + ";";
	}
	Grid_IssueUnitObj.addRow();
	Grid_IssueUnitObj.clearBinding();
	document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
}

function getData_Grid_IssueUnit2(data) {
	document.getElementById("HdnTextbox_IssueUnit").value = data.OID;
	document.getElementById("Textbox_IssueUnitNo").value = data.id;
	document.getElementById("Textbox_IssueUnitName").value = data.name;
	var sql1 = "select distinct RoleDef.OID, Org.organizationName, RoleDef.roleDefinitionName " + "from Role, Organization Org, RoleDefinition RoleDef " + "where Role.definitionOID = RoleDef.OID " + "and RoleDef.organizationOID = Org.OID";
	var rs1 = tEFGPConn.query(sql1);
	if (rs1.length > 0) {
		document.getElementById("HdnTextbox_RoleOID").value = rs1[0][0];
		document.getElementById("Textbox_RoleName").value = rs1[0][1] + "_" + rs1[0][2];
	}
	var allRelatedUsers = "";
	for (var i = 0; i < data.members.length; i++) {
		allRelatedUsers = allRelatedUsers + data.members[i].id + ";";
	}
	document.getElementById("HdnTextbox_Person").value = allRelatedUsers;
	Grid_IssueUnitObj.addRow();
	Grid_IssueUnitObj.clearBinding();
	document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
}

function getData_Grid_IssueUnit3(data) {
	document.getElementById("HdnTextbox_IssueUnit").value = data.OID;
	document.getElementById("Textbox_IssueUnitNo").value = data.id;
	document.getElementById("Textbox_IssueUnitName").value = data.name;
	var sql1 = "select distinct RoleDef.OID, Org.organizationName, RoleDef.roleDefinitionName " + "from Role, Organization Org, RoleDefinition RoleDef " + "where Role.definitionOID = RoleDef.OID " + "and RoleDef.organizationOID = Org.OID";
	var rs1 = tEFGPConn.query(sql1);
	if (rs1.length > 0) {
		document.getElementById("HdnTextbox_RoleOID").value = rs1[0][0];
		document.getElementById("Textbox_RoleName").value = rs1[0][1] + "_" + rs1[0][2];
	}
	document.getElementById("HdnTextbox_Person").value = document.getElementById("Textbox_IssueUnitNo").value + ";";
	Grid_IssueUnitObj.addRow();
	Grid_IssueUnitObj.clearBinding();
	document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
}
*/

//當文件製作者重新選擇文件類別後填Grid_IssueUnit tGrid_DocCategoryOriginalData為選擇前原始資料

function afterSaveGrid_IssueUnit() {
	var tGridDataRec = Grid_DocCategoryObj.getData();
	if (tGridDataRec.length > 0) {
		for (var i = 0; i < tGridDataRec.length; i++) {
			var sql = "select distinct ReleaseUnitOID, unitType from CustISODocCate_ReleaseUnits " + "where DocCateOID = '" + tGridDataRec[i][0] + "'";	
			var rs = tEFGPConn.query(sql);
			if (rs.length > 0) {
				DWREngine.setAsync(false);
				for (var j = 0; j < rs.length; j++) {					
					getGrid_IssueUnitData(tGridDataRec[0][0],rs[j][1]);
				}
			}
		}
	}
}

function getGrid_IssueUnitData(DocCategoryOID,type){
	if(type=="DEPT"){		 
		var sql = "select distinct Unit.OID, Unit.id, Unit.organizationUnitName, RD.OID, "+
                "(Org.organizationName+'_'+RD.roleDefinitionName) RoleName "+
                "from CustISODocCate_ReleaseUnits RU "+
                "left join OrganizationUnit Unit on Unit.OID = RU.ReleaseUnitOID "+
                "left join Organization Org on Org.OID = Unit.organizationOID "+
                "left join RoleDefinition RD on RU.roleDefOID = RD.OID "+
                "left join Role R on RD.OID = R.definitionOID "+
                "left join Functions F on F.organizationUnitOID = Unit.OID "+
                "left join Users U on F.occupantOID = U.OID "+
                "where RU.DocCateOID = '"+DocCategoryOID+"' "+
                "and RU.unitType = 'DEPT' and F.occupantOID in "+
                "(select R1.actorOID from Role R1, RoleDefinition RD2 "+
                "where R1.definitionOID = RD2.OID) ";
		var rs = tEFGPConn.query(sql);
		if (rs.length > 0) {
			var trs=eval(rs);
			for(var i=0;i<trs.length;i++){
				document.getElementById("HdnTextbox_IssueUnit").value = trs[i][0];
				document.getElementById("Textbox_IssueUnitNo").value = trs[i][1];
				document.getElementById("Textbox_IssueUnitName").value = trs[i][2];
				document.getElementById("HdnTextbox_RoleOID").value = trs[i][3];
				document.getElementById("Textbox_RoleName").value = trs[i][4];
				document.getElementById("HdnTextbox_Person").value = "";
				var tData=Grid_IssueUnitObj.getData();
				if(tData.length>0){
					var tSame="N";
					for(var j=0;j<tData.length;j++){
						if(tData[j][0]==trs[i][0] && tData[j][4]==trs[i][3]){
							tSame="Y";
						}
					}
					if(tSame=="N"){
						DWREngine.setAsync(false);
						ajax_ExtOrgAccessor.findActorOfRoleDef(trs[i][3],trs[i][0],false,function(data){
						for(var k=0;k<data.length;k++){
							document.getElementById("HdnTextbox_Person").value=document.getElementById("HdnTextbox_Person").value+data[k].id+";";			
						}
						});
						DWREngine.setAsync(true);
						//alert("3 = "+document.getElementById("HdnTextbox_Person").value);
						Grid_IssueUnitObj.addRow();
						Grid_IssueUnitObj.clearBinding();
						document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
					}				
				}else{
					DWREngine.setAsync(false);
					ajax_ExtOrgAccessor.findActorOfRoleDef(trs[i][3],trs[i][0],false,function(data){
					for(var k=0;k<data.length;k++){
						document.getElementById("HdnTextbox_Person").value=document.getElementById("HdnTextbox_Person").value+data[k].id+";";			
					}
					});
					DWREngine.setAsync(true);
					//alert("3 = "+document.getElementById("HdnTextbox_Person").value);
					Grid_IssueUnitObj.addRow();
					Grid_IssueUnitObj.clearBinding();
					document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
				}
			}
			
		}
	}else if(type=="GROUP"){
		var sql =  "select distinct Unit.OID, Unit.id, Unit.organizationUnitName, RD.OID, "+
                "(Org.organizationName+'_'+RD.roleDefinitionName) RoleName "+
                "from CustISODocCate_ReleaseUnits RU "+
                "left join Groups G on RU.ReleaseUnitOID = G.OID "+
                "left join Group_User GU on GU.GroupOID = G.OID "+ 
                "left join Users U on GU.UserOID = U.OID "+
                "left join Functions F on F.occupantOID = U.OID "+
                "left join RoleDefinition RD on RU.roleDefOID = RD.OID "+
                "left join Role R on RD.OID = R.definitionOID "+
                "left join OrganizationUnit Unit on Unit.OID = F.organizationUnitOID "+
                "left join Organization Org on Org.OID = Unit.organizationOID "+
                "where RU.DocCateOID = '"+DocCategoryOID+"' "+
                "and RU.unitType = 'GROUP' and F.isMain = 1 ";
				//alert(sql);
		var rs = tEFGPConn.query(sql);
		if (rs.length > 0) {
			var trs=eval(rs);
			for(var i=0;i<trs.length;i++){
				document.getElementById("HdnTextbox_IssueUnit").value = trs[i][0];
				document.getElementById("Textbox_IssueUnitNo").value = trs[i][1];
				document.getElementById("Textbox_IssueUnitName").value = trs[i][2];
				document.getElementById("HdnTextbox_RoleOID").value = trs[i][3];
				document.getElementById("Textbox_RoleName").value = trs[i][4];
				document.getElementById("HdnTextbox_Person").value = "";
				var tData=Grid_IssueUnitObj.getData();
				if(tData.length>0){
					var tSame="N";
					for(var j=0;j<tData.length;j++){
						if(tData[j][0]==trs[i][0] && tData[j][4]==trs[i][3]){
							tSame="Y";
						}
					}
					if(tSame=="N"){
						DWREngine.setAsync(false);
						ajax_ExtOrgAccessor.findActorOfRoleDef(trs[i][3],trs[i][0],false,function(data){
						for(var k=0;k<data.length;k++){
							document.getElementById("HdnTextbox_Person").value=document.getElementById("HdnTextbox_Person").value+data[k].id+";";			
						}
						});
						DWREngine.setAsync(true);
						//alert("3 = "+document.getElementById("HdnTextbox_Person").value);
						Grid_IssueUnitObj.addRow();
						Grid_IssueUnitObj.clearBinding();
						document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
					}				
				}else{
					DWREngine.setAsync(false);
					ajax_ExtOrgAccessor.findActorOfRoleDef(trs[i][3],trs[i][0],false,function(data){
					for(var k=0;k<data.length;k++){
						document.getElementById("HdnTextbox_Person").value=document.getElementById("HdnTextbox_Person").value+data[k].id+";";			
					}
					});
					DWREngine.setAsync(true);
					//alert("3 = "+document.getElementById("HdnTextbox_Person").value);
					Grid_IssueUnitObj.addRow();
					Grid_IssueUnitObj.clearBinding();
					document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
				}
			}
			
		}
	}else if(type=="USER"){
		var sql = "select distinct Unit.OID, Unit.id, Unit.organizationUnitName, RD.OID, "+
                "(Org.organizationName+'_'+RD.roleDefinitionName) RoleName "+
                "from CustISODocCate_ReleaseUnits RU "+
                "left join Users U on RU.ReleaseUnitOID = U.OID "+
                "left join Functions F on F.occupantOID = U.OID "+
                "left join RoleDefinition RD on RU.roleDefOID = RD.OID "+
                "left join Role R on RD.OID = R.definitionOID "+
                "left join OrganizationUnit Unit on Unit.OID = F.organizationUnitOID "+
                "left join Organization Org on Org.OID = Unit.organizationOID "+
                "where RU.DocCateOID = '"+DocCategoryOID+"' "+
                "and RU.unitType = 'USER' and F.isMain = 1 ";
		var rs = tEFGPConn.query(sql);
		if (rs.length > 0) {
			var trs=eval(rs);
			for(var i=0;i<trs.length;i++){
				document.getElementById("HdnTextbox_IssueUnit").value = trs[i][0];
				document.getElementById("Textbox_IssueUnitNo").value = trs[i][1];
				document.getElementById("Textbox_IssueUnitName").value = trs[i][2];
				document.getElementById("HdnTextbox_RoleOID").value = trs[i][3];
				document.getElementById("Textbox_RoleName").value = trs[i][4];
				document.getElementById("HdnTextbox_Person").value = "";
				var tData=Grid_IssueUnitObj.getData();
				if(tData.length>0){
					var tSame="N";
					for(var j=0;j<tData.length;j++){
						if(tData[j][0]==trs[i][0] && tData[j][4]==trs[i][3]){
							tSame="Y";
						}
					}
					if(tSame=="N"){
						DWREngine.setAsync(false);
						ajax_ExtOrgAccessor.findActorOfRoleDef(trs[i][3],trs[i][0],false,function(data){
						for(var k=0;k<data.length;k++){
							document.getElementById("HdnTextbox_Person").value=document.getElementById("HdnTextbox_Person").value+data[k].id+";";			
						}
						});
						DWREngine.setAsync(true);
						//alert("3 = "+document.getElementById("HdnTextbox_Person").value);
						Grid_IssueUnitObj.addRow();
						Grid_IssueUnitObj.clearBinding();
						document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
					}				
				}else{
					DWREngine.setAsync(false);
					ajax_ExtOrgAccessor.findActorOfRoleDef(trs[i][3],trs[i][0],false,function(data){
					for(var k=0;k<data.length;k++){
						document.getElementById("HdnTextbox_Person").value=document.getElementById("HdnTextbox_Person").value+data[k].id+";";			
					}
					});
					DWREngine.setAsync(true);
					//alert("3 = "+document.getElementById("HdnTextbox_Person").value);
					Grid_IssueUnitObj.addRow();
					Grid_IssueUnitObj.clearBinding();
					document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
				}
			}
			
		}
	}

}

//當文件製作者重新選擇文件類別後填Grid_RelateUnit
function afterSaveGrid_RelateUnit() {
	var tGridDataRec = Grid_DocCategoryObj.getData();
	if (tGridDataRec.length > 0) {
		for (var i = 0; i < tGridDataRec.length; i++) {
			var sql = "select distinct orgUnitOID, unitType from CustISODocCate_Units " + "where DocCateOID = '" + tGridDataRec[i][0] + "'";
			var rs = tEFGPConn.query(sql);
			if (rs.length > 0) {
				DWREngine.setAsync(false);
				for (var j = 0; j < rs.length; j++) {
					if (rs[j][1] == "DEPT") {
						document.getElementById("Dropdown_RelatedUnits").value = "1";
						ajax_OrgAccessor.findOrgUnitByOID(rs[j][0], getData_Grid_RelateUnit1);
					} else if (rs[j][1] == "GROUP") {
						document.getElementById("Dropdown_RelatedUnits").value = "3";
						ajax_OrgAccessor.findGroupByOID(rs[j][0], getData_Grid_RelateUnit2);
					} else if (rs[j][1] == "USER") {
						document.getElementById("Dropdown_RelatedUnits").value = "4";
						ajax_OrgAccessor.findUserByOID(rs[j][0], getData_Grid_RelateUnit_USER);
					}
				}
				DWREngine.setAsync(true);
			}
		}
	}
}

function getData_Grid_RelateUnit1(data) {
	document.getElementById("HdnTextbox_RelatedUnit").value = data.OID;
	document.getElementById("Textbox_RelatedUnitNo").value = data.id;
	document.getElementById("Textbox_RelatedUnitName").value = data.name;
	var sql2 = "select U.id from Users U, OrganizationUnit O where O.managerOID = U.OID and O.OID = '" + data.OID + "'";
	var rs2 = tEFGPConn.query(sql2);
	if (rs2.length > 0) {
		document.getElementById("HdnTextbox_UnitUsers").value = rs2[0][0] + ";";
	}
	Grid_RelateUnitObj.addRow();
	Grid_RelateUnitObj.clearBinding();
	document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();
	
	//20160318 add 將表單欄位寫入 Grid_RelateUnit_EFGP 且 Grid_RelateUnit要隱藏
	var tGridId = Grid_RelateUnitObj.getId();
	var tGridElement = document.getElementById(tGridId);
	tGridElement.style.display = "none";
		
	//Grid_RelateUnit_EFGP
	Grid_RelateUnit_EFGPObj.reload(eval(document.getElementById("Grid_RelateUnit").value));
	document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString(); //	eval(gRelateUnitData);
	
}

function getData_Grid_RelateUnit2(data) {
	document.getElementById("HdnTextbox_RelatedUnit").value = data.OID;
	document.getElementById("Textbox_RelatedUnitNo").value = data.id;
	document.getElementById("Textbox_RelatedUnitName").value = data.name;
	var allRelatedUsers = "";
	for (var i = 0; i < data.members.length; i++) {
		allRelatedUsers = allRelatedUsers + data.members[i].id + ";";
	}
	document.getElementById("HdnTextbox_UnitUsers").value = allRelatedUsers;
	Grid_RelateUnitObj.addRow();
	Grid_RelateUnitObj.clearBinding();
	document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();
	
	//20160318 add 將表單欄位寫入 Grid_RelateUnit_EFGP 且 Grid_RelateUnit要隱藏
	var tGridId = Grid_RelateUnitObj.getId();
	var tGridElement = document.getElementById(tGridId);
	tGridElement.style.display = "none";
		
	//Grid_RelateUnit_EFGP
	Grid_RelateUnit_EFGPObj.reload(eval(document.getElementById("Grid_RelateUnit").value));
	document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString(); //	eval(gRelateUnitData);
	
}

function getData_Grid_RelateUnit_USER(data) {
	document.getElementById("HdnTextbox_RelatedUnit").value = data.OID;
	document.getElementById("Textbox_RelatedUnitNo").value = data.id;
	document.getElementById("Textbox_RelatedUnitName").value = data.name;
	document.getElementById("HdnTextbox_UnitUsers").value = data.id + ";";
	Grid_RelateUnitObj.addRow();
	Grid_RelateUnitObj.clearBinding();
	document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();
	
	//20160318 add 將表單欄位寫入 Grid_RelateUnit_EFGP 且 Grid_RelateUnit要隱藏
	var tGridId = Grid_RelateUnitObj.getId();
	var tGridElement = document.getElementById(tGridId);
	tGridElement.style.display = "none";
		
	//Grid_RelateUnit_EFGP
	Grid_RelateUnit_EFGPObj.reload(eval(document.getElementById("Grid_RelateUnit").value));
	document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString(); //	eval(gRelateUnitData);
	
}

//關聯文件是否需要變更欄位
function rdoNeedMod_onclick() {
	var trdoNeedMod_0 = document.getElementById("rdoNeedMod_0");
	var trdoNeedMod_1 = document.getElementById("rdoNeedMod_1");
	if (trdoNeedMod_0.checked) {
		document.getElementById("hdnNeedMod").value = "Y";
		document.getElementById("btnRelatedProcessSN").disabled = false;
	} else if (trdoNeedMod_1.checked) {
		document.getElementById("hdnNeedMod").value = "N";
		document.getElementById("btnRelatedProcessSN").disabled = true;
	}
}

//被關聯文件是否需要變更欄位
function rdoAlNeedMod_onclick() {
	var trdoAlNeedMod_0 = document.getElementById("rdoAlNeedMod_0");
	var trdoAlNeedMod_1 = document.getElementById("rdoAlNeedMod_1");
	//var tRadioButton = document.getElementsByName("rdoAlNeedMod");
	if (trdoAlNeedMod_0.checked) {
		document.getElementById("hdnAlNeedMod").value = "Y";
		document.getElementById("btnAlRelatedProcessSN").disabled = false;
	} else if (trdoAlNeedMod_1.checked) {
		document.getElementById("hdnAlNeedMod").value = "N";
		document.getElementById("btnAlRelatedProcessSN").disabled = true;
	}
}

//關聯文件jsp連結
function btnRelatedProcessSN_onclick() {
	var hdnDocNoValue = document.getElementById("hdnDocNo").value;
	if (hdnDocNoValue == "") {
		alert("請先選擇表格中要更新的一條記錄！");
		return false;
	}
	//window.open("/NaNaWeb/CustomOpenWin/ModDocSelectModList.jsp?hdnDocNo=" + hdnDocNoValue);
	var ret = window.showModalDialog("/NaNaWeb/CustomOpenWin/ModDocSelectModList.jsp?hdnDocNo=" + hdnDocNoValue,null,"dialogWidth:800px;dialogHeight:500px;help:no;status:no");
	//20160112 mod by Hsieh 調整顯示 沒選擇時出現 undefined 
	if(ret!=undefined){
		document.getElementById("txtRelatedProcessSN").value = ret;
	}else{
		document.getElementById("txtRelatedProcessSN").value = "";
	}	
	//alert("ret = "+ret);
}

//被關聯文件jsp連結
function btnAlRelatedProcessSN_onclick() {
	var hdnAlDocNoValue = document.getElementById("hdnAlDocNo").value;
	if (hdnAlDocNoValue == "") {
		alert("請先選擇表格中要更新的一條記錄！");
		return false;
	}
	//window.open("/NaNaWeb/CustomOpenWin/ModDocSelectModList.jsp?hdnAlDocNo=" + hdnAlDocNoValue);
	var ret = window.showModalDialog("/NaNaWeb/CustomOpenWin/ModDocSelectModList.jsp?hdnAlDocNo=" + hdnAlDocNoValue,null,"dialogWidth:800px;dialogHeight:500px;help:no;status:no");
	//20160112 mod by Hsieh 調整顯示 沒選擇時出現 undefined 
	if(ret!=undefined){
		document.getElementById("txtAlRelatedProcessSN").value = ret;
	}else{
		document.getElementById("txtAlRelatedProcessSN").value = "";
	}		
}

//jsp連結回调页面
function refresh(value, data) {
	if (value == "hdnAlDocNo") {
		document.getElementById("txtAlRelatedProcessSN").value = data;
	} else if (value == "hdnDocNo") {
		//alert(data);
		document.getElementById("txtRelatedProcessSN").value = data;
	}
}

//關聯文件更新
function Btn_EditRelatedDoc_onclick() {
	var trdoNeedMod_0 = document.getElementById("rdoNeedMod_0");
	var trdoNeedMod_1 = document.getElementById("rdoNeedMod_1");
	if (document.getElementById("hdnNeedMod").value == "Y") {
		if (document.getElementById("txtRelatedProcessSN").value == "") {
			alert("如需變更請選擇對應之變更單資料!");
			return false;
		}
	} else if (document.getElementById("hdnNeedMod").value == "N") {
		document.getElementById("txtRelatedProcessSN").value = "";
	} else {
		alert("請選擇此文件編號是否需要變更!");
		return false;
	}

	var Grid_RelatedDocData = Grid_RelatedDocObj.getData();
	if (Grid_RelatedDocData.length > 0) {
		for (var i = 0; i < Grid_RelatedDocData.length; i++) {
			if (Grid_RelatedDocData[i][1] == document.getElementById("hdnDocNo").value) {
				Grid_RelatedDocData[i][4] = document.getElementById("hdnNeedMod").value;
				Grid_RelatedDocData[i][5] = document.getElementById("txtRelatedProcessSN").value;
			}
		}
	}
	document.getElementById("Grid_RelatedDoc").value = Grid_RelatedDocObj.toArrayString(); //將新的資料存入Grid隱藏欄位中
	Grid_RelatedDocObj.reload(eval(document.getElementById("Grid_RelatedDoc").value));

	var Grid_AlRelatedDocData = Grid_AlRelatedDocObj.getData();
	if (Grid_AlRelatedDocData.length > 0) {
		for (var i = 0; i < Grid_AlRelatedDocData.length; i++) {
			if (Grid_AlRelatedDocData[i][1] == document.getElementById("hdnDocNo").value) {
				Grid_AlRelatedDocData[i][4] = document.getElementById("hdnNeedMod").value;
				Grid_AlRelatedDocData[i][5] = document.getElementById("txtRelatedProcessSN").value;
			}
		}
	}
	document.getElementById("Grid_AlRelatedDoc").value = Grid_AlRelatedDocObj.toArrayString(); //將新的資料存入Grid隱藏欄位中
	Grid_AlRelatedDocObj.reload(eval(document.getElementById("Grid_AlRelatedDoc").value));
	document.getElementById("txtRelatedProcessSN").value = "";
	//var tRadioButton = document.getElementsByName("rdoNeedMod");
	trdoNeedMod_0.checked = false;
	trdoNeedMod_1.checked = false;
	//20160129 add by Hsieh
	document.getElementById("HdnTextbox_RelatedDoc").value=Grid_RelatedDocObj.toArrayString(); 
	document.getElementById("HdnTextbox_AlRelatedDoc").value=Grid_AlRelatedDocObj.toArrayString(); 
}

//被關聯文件更新
function Btn_EditAlRelatedDoc_onclick() {
	var trdoAlNeedMod_0 = document.getElementById("rdoAlNeedMod_0");
	var trdoAlNeedMod_1 = document.getElementById("rdoAlNeedMod_1");
	if (document.getElementById("hdnAlNeedMod").value == "Y") {
		if (document.getElementById("txtAlRelatedProcessSN").value == "") {
			alert("如需變更請選擇對應之變更單資料!");
			return false;
		}
	} else if (document.getElementById("hdnAlNeedMod").value == "N") {
		document.getElementById("txtAlRelatedProcessSN").value = "";
	} else {
		alert("請選擇此文件編號是否需要變更!");
		return false;
	}

	var Grid_RelatedDocData = Grid_RelatedDocObj.getData();
	if (Grid_RelatedDocData.length > 0) {
		for (var i = 0; i < Grid_RelatedDocData.length; i++) {
			if (Grid_RelatedDocData[i][1] == document.getElementById("hdnAlDocNo").value) {
				Grid_RelatedDocData[i][4] = document.getElementById("hdnAlNeedMod").value;
				Grid_RelatedDocData[i][5] = document.getElementById("txtAlRelatedProcessSN").value;
			}
		}
	}
	document.getElementById("Grid_RelatedDoc").value = Grid_RelatedDocObj.toArrayString(); //將新的資料存入Grid隱藏欄位中
	Grid_RelatedDocObj.reload(eval(document.getElementById("Grid_RelatedDoc").value));

	var Grid_AlRelatedDocData = Grid_AlRelatedDocObj.getData();
	if (Grid_AlRelatedDocData.length > 0) {
		for (var i = 0; i < Grid_AlRelatedDocData.length; i++) {
			if (Grid_AlRelatedDocData[i][1] == document.getElementById("hdnAlDocNo").value) {
				Grid_AlRelatedDocData[i][4] = document.getElementById("hdnAlNeedMod").value;
				Grid_AlRelatedDocData[i][5] = document.getElementById("txtAlRelatedProcessSN").value;
			}
		}
	}
	document.getElementById("Grid_AlRelatedDoc").value = Grid_AlRelatedDocObj.toArrayString(); //將新的資料存入Grid隱藏欄位中
	Grid_AlRelatedDocObj.reload(eval(document.getElementById("Grid_AlRelatedDoc").value));
	document.getElementById("txtAlRelatedProcessSN").value = "";
	//var tRadioButton = document.getElementsByName("rdoAlNeedMod");
	trdoAlNeedMod_0.checked = false;
	trdoAlNeedMod_1.checked = false;
	//20160129 add by Hsieh
	document.getElementById("HdnTextbox_RelatedDoc").value=Grid_RelatedDocObj.toArrayString(); 
	document.getElementById("HdnTextbox_AlRelatedDoc").value=Grid_AlRelatedDocObj.toArrayString(); 
}
//20160112 add by Hsieh 全域變數
var watermarkContext = "";//浮水印
var FormInstanceData = "";
//关联文件
function btnViewRelatedDoc_onclick() {
	var tGridId = Grid_ViewRelatedDocObj.getId();
	var tGridElement = document.getElementById(tGridId);
	tGridElement.style.display = "";
	watermarkContext = "";
	var sql = "select watermarkContext from ISOWatermarkPattern " + "where checkValue = '10000000' and watermark = 'true'";
	var rs = tEFGPConn.query(sql);
	if (rs.length > 0) {
		watermarkContext = rs[0][0];
	}
	//alert("watermarkContext"+watermarkContext);
	FormInstanceData = "";
	var Grid_RelatedDocData = Grid_RelatedDocObj.getData();
	//20160112 mod by Hsieh 針對點擊Grid_RelatedDoc的某筆資料進行開窗
	if (Grid_RelatedDocData.length > 0) {
		if(Grid_RelatedDocObj.getRowIndex()==-1){
			alert("請先選擇一筆關聯文件資料");
		}else{			
			var i = Grid_RelatedDocObj.getRowIndex();
			DWREngine.setAsync(false);//開啟Ajax同步
			ajax_IsoModuleAccessor.getDocumentDTOByOID(Grid_RelatedDocData[i][0], false, "Released", getGrid_ViewRelatedDocData);
			DWREngine.setAsync(true);//開啟Ajax同步
			//alert("关联文件Grid_ViewRelatedDoc数据：" + FormInstanceData);
			FormInstanceData = "[" + FormInstanceData.substring(0, FormInstanceData.length - 1) + "]";
			if (FormInstanceData != "[]") {
				Grid_ViewRelatedDocObj.reload(eval(FormInstanceData));
			}
			document.getElementById("Grid_ViewRelatedDoc").value = Grid_ViewRelatedDocObj.toArrayString();
			//FormInstanceData = "";
		}
	}
	
}

function getGrid_ViewRelatedDocData(data) {
	//alert(DWRUtil.toDescriptiveString(data,2));//看物件內容
	//alert(data.document.files);
	if(data.document.files!=null){
		for (var i = 0; i < data.document.files.length; i++) {
			var sql = "select id from NoCmDocument where OID = '" + data.document.files[i].sourceFileOID + "'";
			var rs = tEFGPConn.query(sql);
			var id = "";
			if (rs.length > 0) {
				id = rs[0][0];
			}
			//alert("id="+id);

			FormInstanceData = FormInstanceData + "['" + (i + 1) + "','" + data.document.files[i].fileType + "','" + data.document.files[i].originalName + "','" + data.document.files[i].description + "','" + id + "','" + watermarkContext + "','" + data.document.files[i].sourceFileOID + "'],";
		
		}
	}else{
		alert("此文件無附件內容!");
	}
	
}

//被关联文件
function btnViewAlRelatedDoc_onclick() {
	var tGridId = Grid_ViewAlRelatedDocObj.getId();
	var tGridElement = document.getElementById(tGridId);
	tGridElement.style.display = "";

	var sql = "select watermarkContext from ISOWatermarkPattern " + "where checkValue = '10000000' and watermark = 'true'";
	var rs = tEFGPConn.query(sql);
	watermarkContext = "";
	if (rs.length > 0) {
		watermarkContext = rs[0][0];
	}
	FormInstanceData = "";
	var Grid_AlRelatedDocData = Grid_AlRelatedDocObj.getData();
	//20160112 mod by Hsieh 針對點擊Grid_RelatedDoc的某筆資料進行開窗
	if (Grid_AlRelatedDocData.length > 0) {
		if(Grid_AlRelatedDocObj.getRowIndex()==-1){
			alert("請先選擇一筆被關聯文件資料");
		}else{			
			var i = Grid_AlRelatedDocObj.getRowIndex();
			DWREngine.setAsync(false);//開啟Ajax同步
			ajax_IsoModuleAccessor.getDocumentDTOByOID(Grid_AlRelatedDocData[i][0], false, "Released", getGrid_ViewRelatedDocData);
			DWREngine.setAsync(true);//開啟Ajax同步
			//alert("被关联文件Grid_ViewAlRelatedDoc数据：" + FormInstanceData);
			FormInstanceData = "[" + FormInstanceData.substring(0, FormInstanceData.length - 1) + "]";
			if (FormInstanceData != "[]") {
				Grid_ViewAlRelatedDocObj.reload(eval(FormInstanceData));
			}
			document.getElementById("Grid_ViewAlRelatedDoc").value = Grid_ViewAlRelatedDocObj.toArrayString();
			//FormInstanceData = "";
		}
	}
	
	/*
	if (Grid_AlRelatedDocData.length > 0) {
		for (var i = 0; i < Grid_AlRelatedDocData.length; i++) {
			ajax_IsoModuleAccessor.getDocumentDTOByOID(Grid_AlRelatedDocData[i][0], false, "Released", getGrid_ViewAlRelatedDocData);
		}
	}
	alert("被关联文件Grid_ViewAlRelatedDoc数据：" + FormInstanceData);
	FormInstanceData = "[" + FormInstanceData.substring(0, FormInstanceData.length - 1) + "]";
	Grid_ViewAlRelatedDocObj.reload(eval(FormInstanceData));
	document.getElementById("Grid_ViewAlRelatedDoc").value = Grid_ViewAlRelatedDocObj.toArrayString();
	FormInstanceData = "";
	*/
}

function getGrid_ViewAlRelatedDocData(data) {
	if(data.document.files!=null){
		for (var i = 0; i < data.document.files.length; i++) {
			var sql = "select id from NoCmDocument where OID = '" + data.document.files[i].sourceFileOID + "'";
			var rs = tEFGPConn.query(sql);
			var id = "";
			if (rs.length > 0) {
				id = rs[0][0];
			}
			FormInstanceData = FormInstanceData + "['" + (i + 1) + "','" + data.document.files[i].fileType + "','" + data.document.files[i].originalName + "','" + data.document.files[i].description + "','" + id + "','" + watermarkContext + "','" + data.document.files[i].sourceFileOID + "'],";
		}
	}else{
		alert("此文件無附件內容!");
	}
}

function gridRowClick(pGridId) {
	if (pGridId == Grid_ViewRelatedDocObj.getId()) { //关联
		var sql = "select webServerAddress from WorkflowServer where isDefault = 1";
		var rs = tEFGPConn.query(sql);
		var twebServerAddress = "";
		if (rs.length > 0) {
			twebServerAddress = rs[0][0];
		}
		var tGrid_Obj = Grid_ViewRelatedDocObj.getData();
		var tdocFileName = tGrid_Obj[Grid_ViewRelatedDocObj.getRowIndex()][4];
		var toriginalFileName = tGrid_Obj[Grid_ViewRelatedDocObj.getRowIndex()][2];
		var twatermarkContext = tGrid_Obj[Grid_ViewRelatedDocObj.getRowIndex()][5];
		//alert("twatermarkContext"+twatermarkContext);
		//先將以下兩個變數塞入session:
		var KEY1 = "HIGH_SECURITY_PDF_URL";
		var VALUE1 = "http://"+twebServerAddress + "/DownloadISOFile?action=downloadConvertDocument&docFileName=" + tdocFileName + "&originalFileName=" + toriginalFileName + "&watermarkContext=" + twatermarkContext + "#toolbar=1";
		//20160113 add By Hsieh 傳入session的URL  需先用encoseURL轉譯 不然會出現亂碼
		VALUE1=encodeURI(VALUE1);		
		//alert("VALUE1="+VALUE1);
		var KEY2 = "PDF_READ_TIME";
		var VALUE2 = 0;
		var tURL = "http://"+twebServerAddress + "/GP/ToolSuite?hdnMethod=openDesigner&hdnAppType=nana-pdf-viewer";
		DWREngine.setAsync(false);
		ajax_CommonAccessor.setSessionValue(KEY1, VALUE1);
		ajax_CommonAccessor.setSessionValue(KEY2, VALUE2);
		DWREngine.setAsync(true);
		/*
		$.ajax({
			type: 'POST',
			url: tURL,
			data: {
				KEY1: VALUE1,
				KEY2: VALUE2
			},
			async: false,
			success: function(data) {}
		});
		*/
		//將變數1及變數2塞入session後，呼叫URL開啟PDF Viewer
		openDialog(tURL, "400", "300", "titlebar,scrollbars,status,resizable");
	}
	if (pGridId == Grid_ViewAlRelatedDocObj.getId()) { //被关联
		var sql = "select webServerAddress from WorkflowServer where isDefault = 1";
		var rs = tEFGPConn.query(sql);
		var twebServerAddress = "";
		if (rs.length > 0) {
			twebServerAddress = rs[0][0];
		}
		var tGrid_Obj = Grid_ViewAlRelatedDocObj.getData();
		var tdocFileName = tGrid_Obj[Grid_ViewAlRelatedDocObj.getRowIndex()][4];
		var toriginalFileName = tGrid_Obj[Grid_ViewAlRelatedDocObj.getRowIndex()][2];
		var twatermarkContext = tGrid_Obj[Grid_ViewAlRelatedDocObj.getRowIndex()][5];
		//先將以下兩個變數塞入session:
		var KEY1 = "HIGH_SECURITY_PDF_URL";
		var VALUE1 = "http://"+twebServerAddress + "/DownloadISOFile?action=downloadConvertDocument&docFileName=" + tdocFileName + "&originalFileName=" + toriginalFileName + "&watermarkContext=" + twatermarkContext + "#toolbar=1";
		//20160113 add By Hsieh 傳入session的URL  需先用encoseURL轉譯 不然會出現亂碼
		VALUE1=encodeURI(VALUE1);
		var KEY2 = "PDF_READ_TIME";
		var VALUE2 = 0;
		var tURL = "http://"+twebServerAddress + "/GP/ToolSuite?hdnMethod=openDesigner&hdnAppType=nana-pdf-viewer";
		DWREngine.setAsync(false);
		ajax_CommonAccessor.setSessionValue(KEY1, VALUE1);
		ajax_CommonAccessor.setSessionValue(KEY2, VALUE2);
		DWREngine.setAsync(true);
		/*
		$.ajax({
			type: 'POST',
			url: tURL,
			data: {
				KEY1: VALUE1,
				KEY2: VALUE2
			},
			async: false,
			success: function(data) {}
		});
		*/
		//將變數1及變數2塞入session後，呼叫URL開啟PDF Viewer
		openDialog(tURL, "400", "300", "titlebar,scrollbars,status,resizable");
	}
	if (pGridId == Grid_ISOFilesObj.getId()) {
		var sql = "select webServerAddress from WorkflowServer where isDefault = 1";
		var rs = tEFGPConn.query(sql);
		var twebServerAddress = "";
		if (rs.length > 0) {
			twebServerAddress = rs[0][0];
		}
		var tGrid_ISOFilesObj = Grid_ISOFilesObj.getData();
		var tdocFileName = tGrid_ISOFilesObj[Grid_ISOFilesObj.getRowIndex()][8];
		var toriginalFileName = tGrid_ISOFilesObj[Grid_ISOFilesObj.getRowIndex()][2];
		var twatermarkContext = tGrid_ISOFilesObj[Grid_ISOFilesObj.getRowIndex()][9];
		//先將以下兩個變數塞入session:
		var KEY1 = "HIGH_SECURITY_PDF_URL";
		var VALUE1 = "http://"+twebServerAddress + "/DownloadISOFile?action=downloadConvertDocument&docFileName=" + tdocFileName + "&originalFileName=" + toriginalFileName + "&watermarkContext=" + twatermarkContext + "#toolbar=1";
		//20160113 add By Hsieh 傳入session的URL  需先用encoseURL轉譯 不然會出現亂碼
		VALUE1=encodeURI(VALUE1);
		var KEY2 = "PDF_READ_TIME";
		var VALUE2 = 0;
		var tURL = "http://"+twebServerAddress + "/GP/ToolSuite?hdnMethod=openDesigner&hdnAppType=nana-pdf-viewer";
		DWREngine.setAsync(false);
		ajax_CommonAccessor.setSessionValue(KEY1, VALUE1);
		ajax_CommonAccessor.setSessionValue(KEY2, VALUE2);
		DWREngine.setAsync(true);
		/*
		$.ajax({
			type: 'POST',
			url: tURL,
			data: {
				KEY1: VALUE1,
				KEY2: VALUE2
			},
			async: false,
			success: function(data) {}
		});
		*/
		//將變數1及變數2塞入session後，呼叫URL開啟PDF Viewer
		openDialog(tURL, "400", "300", "titlebar,scrollbars,status,resizable");
	}
	
	
}

function btnECNNo_onclick() {
	if (document.getElementById("ddlPrice").value == "PCB" || document.getElementById("ddlPrice").value == "Group") {
		var FileName = "SingleOpenWin";
		var tSql = "SELECT pcb_ecn_m002, fill_empl_name, aplydate, CASE resda021 " + "WHEN '1' THEN '簽核中' WHEN '2' THEN '同意' END resda021 " + "FROM dbo.pcb_ecn_m LEFT JOIN resda ON resda001=pcb_ecn_m001 " + "AND resda002=pcb_ecn_m002 WHERE (resda021='1' OR resda021='2')";
		var SQLClaused = new Array(tSql);

		var SQLLabel = new Array("單號", "申請人姓名", "申請日期", "簽核狀態");
		var QBEField = new Array("pcb_ecn_m002", "fill_empl_name", "aplydate", "resda021");
		var QBELabel = new Array("單號", "申請人姓名", "申請日期", "簽核狀態");

		var ReturnId = new Array("txtECNNo", "btnECNNo_PCB1", "btnECNNo_PCB2", "btnECNNo_PCB3");
		singleOpenWin(FileName, databaseCfgId_EF2K, SQLClaused, SQLLabel, QBEField, QBELabel, ReturnId, 700, 430);
	} else if (document.getElementById("ddlPrice").value == "Carrier" ) {
		var FileName = "SingleOpenWin";
		var tSql = "select  Frm03.formSerialNumber, Frm03.aply_name, convert(VARCHAR(100),Frm03.aply_date,111), " + "CASE PI.currentState WHEN '1' THEN '簽核中' WHEN '3' THEN '同意' END currentState ,PI.OID " + "from frm_03_carecr Frm03, ProcessInstance PI " + "where Frm03.processSerialNumber = PI.serialNumber and PI.currentState <= 3";
		var SQLClaused = new Array(tSql);

		var SQLLabel = new Array("單號", "申請人姓名", "申請日期", "簽核狀態");
		var QBEField = new Array("Frm03.formSerialNumber", "Frm03.aply_name", "Frm03.aply_date", "PI.currentState");
		var QBELabel = new Array("單號", "申請人姓名", "申請日期", "簽核狀態");

		var ReturnId = new Array("txtECNNo");		
		singleOpenWin(FileName, databaseCfgId_EFGP, SQLClaused, SQLLabel, QBEField, QBELabel, ReturnId, 700, 430);
	}
}

//20160323 mod By Hsieh 將隱藏欄位hdnProcessInstOID值寫入
function checkPointOnClose(pReturnId) {
	if(pReturnId == 'txtECNNo') {
		if(document.getElementById("ddlPrice").value == "Carrier"){
			var tSql = "select  PI.OID  from frm_03_carecr Frm03, ProcessInstance PI where Frm03.processSerialNumber = PI.serialNumber and PI.currentState <= 3 and Frm03.formSerialNumber='"+document.getElementById("txtECNNo").value+"' ";
			var trs = tEFGPConn.query(tSql);
			if (trs.length > 0) {
				document.getElementById("hdnProcessInstOID").value = trs[0][0];
			}
		}
	}
}

function btnPCB_SBU_onclick() {
	window.open("http://workflow/EF2KWeb/CHT/Program/PCB_ECR_Q/PCB_ECR_Q_Query.asp?ProgID=PCB_ECR_Q&ProgInit=Y&terry=Y");
}

function btnCAR_SBU_onclick() {
	if (document.getElementById("txtECNNo").value == "") {
		alert("請先選擇ECR單號!");
		return false;
	} else {
		window.open("/NaNaWeb/GP/WMS/TraceProcess/TraceProcessMain?hdnMethod=traceProcessFromExternalWeb&hdnProcessInstOID=" + document.getElementById("hdnProcessInstOID").value + "&hdnCurrentUserId=" + userId);
	}
}
//20160323 mod By Hsieh 
function rdoIsNeed_onclick() {
	var trdoIsNeed_0 = document.getElementById("rdoIsNeed_0");
	var trdoIsNeed_1 = document.getElementById("rdoIsNeed_1");
	document.getElementById("txtECNNo").value="";
	
	document.getElementById("hdnProcessInstOID").value="";
	document.getElementById("txaUnNessResason").value="";
	if (trdoIsNeed_0.checked) {
		document.getElementById("hdnIsNeed").value = trdoIsNeed_0.value;
		document.getElementById("btnECNNo").disabled = false;
	}else{
		document.getElementById("hdnIsNeed").value = trdoIsNeed_1.value;
		if (document.getElementById("hdnIsNeed").value == "N") {
			alert("警告！\n請詳述不需要之理由，嚴禁僅用'NA'字眼描述！");
		}
		document.getElementById("btnECNNo").disabled = true;
	}
}
//20160323 mod By Hsieh 
function rdoAddQC_onclick() {
	var trdoAddQC_0 = document.getElementById("rdoAddQC_0");
	var trdoAddQC_1 = document.getElementById("rdoAddQC_1");
	document.getElementById("Dropdown_QCUnits").value=1;
	document.getElementById("txtAddQC").value="";
	document.getElementById("txtAddQCName").value="";
	document.getElementById("HdnTextbox_QCMan").value="";
	
	if (trdoAddQC_0.checked) {
		document.getElementById("hdnAddQC").value = document.getElementById("rdoAddQC_0").value;		
		document.getElementById("Dropdown_QCUnits").disabled = true;
		document.getElementById("btnAddQC").disabled = true;			
	}else{
		document.getElementById("hdnAddQC").value = document.getElementById("rdoAddQC_1").value;
		document.getElementById("Dropdown_QCUnits").disabled = false;
		document.getElementById("btnAddQC").disabled = false;
	}
}

//ISO附件
function btnOpenISOFiles_onclick() {
	var tGridId = Grid_ISOFilesObj.getId();
	var tGridElement = document.getElementById(tGridId);
	tGridElement.style.display = "";
	DWREngine.setAsync(false);
	ajax_FormAccessor.findFormInstance(formInstOID, loadFormInstance);
	DWREngine.setAsync(true);
}

function loadFormInstance(data) {
	//alert(DWRUtil.toDescriptiveString(data, 2));
	var sql = "select watermarkContext from ISOWatermarkPattern " + "where checkValue = '10000000' and watermark = 'true'";
	var rs = tEFGPConn.query(sql);
	var watermarkContext = "";
	if (rs.length > 0) {
		watermarkContext = rs[0][0];
	}
	FormInstanceData = "";
	var xml = data.fieldValues; //取出表單實例中的表單xml   
	var dom = DWREngine._unserializeDocument(xml);  //將xml轉為dom   
	//alert(dom.getElementsByTagName("attachment").getAttribute("fileSize")); //取出資料
	var tDate="";
	var tYear="";
	var tMonth="";
	var tDay="";
	var tHour="";
	var tMinute="";
	var tSecond="";
	var tUploadTime="";
	//var tGrid_ISOFiles=[];
	for (var i = 0; i < data.attachments.length; i++) {
		//var tGrid_ISOFiles_rec=[];
		if (Number(data.attachments[i].fileSize) >= 1048576) {
			data.attachments[i].fileSize = Number(data.attachments[i].fileSize) / 1048576 + "MB";
		} else {
			data.attachments[i].fileSize = Number(data.attachments[i].fileSize) / 1024 + "KB";
		}
		tDate=dom.getElementsByTagName("attachment")[i].getAttribute("uploadTime");
		//alert("tDate="+tDate);
		//alert("123 = "+objToString(data.attachments[i]));
		var dateOne = new Date(parseInt(tDate));
		tYear=dateOne.getFullYear();
		tMonth=dateOne.getMonth()+1;
		tDay=dateOne.getDate();
		tHour=dateOne.getHours();
		tMinute=dateOne.getMinutes();
		tSecond=dateOne.getSeconds();		
		(tMonth < 10)? tMonth = "0" + tMonth : tMonth;
		(tDay < 10)? tDay = "0" + tDay : tDay;
		(tHour < 10)? tHour = "0" + tHour : tHour;
		(tMinute < 10)? tMinute = "0" + tMinute : tMinute;
		(tSecond < 10)? tSecond = "0" + tSecond : tSecond;
		tUploadTime=tYear+"-"+tMonth+"-"+tDay+" "+tHour+":"+tMinute+":"+tSecond;
		/*
		tGrid_ISOFiles_rec.push(i + 1);
		tGrid_ISOFiles_rec.push(data.attachments[i].fileType);
		tGrid_ISOFiles_rec.push(data.attachments[i].originalFileName);
		tGrid_ISOFiles_rec.push(data.attachments[i].description);
		tGrid_ISOFiles_rec.push(data.attachments[i].fileSize);
		tGrid_ISOFiles_rec.push(tUploadTime);
		tGrid_ISOFiles_rec.push(data.attachments[i].creatorName);
		tGrid_ISOFiles_rec.push(data.attachments[i].activityName);
		tGrid_ISOFiles_rec.push(data.attachments[i].id );
		tGrid_ISOFiles_rec.push(watermarkContext);
		*/
		//tGrid_ISOFiles_rec.push(i + 1);
		/*
		tGrid_ISOFiles_rec.push(1);
		tGrid_ISOFiles_rec.push(2);
		tGrid_ISOFiles_rec.push(3);
		tGrid_ISOFiles_rec.push(4);
		tGrid_ISOFiles_rec.push(5);
		tGrid_ISOFiles_rec.push(6);
		tGrid_ISOFiles_rec.push(7);
		tGrid_ISOFiles_rec.push(8);
		tGrid_ISOFiles_rec.push(9);
		*/
		//tGrid_ISOFiles.push(tGrid_ISOFiles_rec);
		//FormInstanceData = FormInstanceData + "['" + (i + 1) + "','" + data.attachments[i].fileType + "','" + data.attachments[i].originalFileName + "','" + data.attachments[i].description + "','" + data.attachments[i].fileSize + "','" + data.attachments[i].uploadTime + "','" + data.attachments[i].creatorName + "','" + data.attachments[i].activityName + "','" + data.attachments[i].id + "','" + watermarkContext + "','" + "'],";
		FormInstanceData = FormInstanceData + "['" + (i + 1) + "','" + data.attachments[i].fileType + "','" + data.attachments[i].originalFileName + "','" + data.attachments[i].description + "','" + data.attachments[i].fileSize + "','" + tUploadTime + "','" + data.attachments[i].creatorName + "','" + data.attachments[i].activityName + "','" + data.attachments[i].id + "','" + watermarkContext + "'],";
	}
	//alert("tGrid_ISOFiles = "+tGrid_ISOFiles.length);
	FormInstanceData = "[" + FormInstanceData.substring(0, FormInstanceData.length - 1) + "]";	
	Grid_ISOFilesObj.reload(eval(FormInstanceData));
	document.getElementById("Grid_ISOFiles").value = Grid_ISOFilesObj.toArrayString();
}

/**
 * 是否會簽业务部客制开窗
 */
function btnAddSales_onclick(){
	if(document.getElementById("hdnPrice").value == ""){
		alert("請選擇事業別!");
	}else{
		chooseInputLabels_Unit("hdnAddSales");
	}
}
/*


function setGrid_RelateUnit() {
	document.getElementById("txtAddSales").value = "";
	var tArr = eval(document.getElementById("hdnAddSales").value);
	for (var i = 0; i < tArr.length; i++) {
		var sql = "select Groups.id, Groups.groupName, Groups.OID,Users.id, Users.userName " + "from Groups, Group_User, Users " + "where Groups.OID = Group_User.GroupOID " + "and Group_User.UserOID = Users.OID " + "and Groups.id = '" + tArr[i][1] + "'";
		var rs = tEFGPConn.query(sql);
		if (rs.length > 0) {
			ajax_OrgAccessor.findGroupByOID(rs[0][2], getData_Grid_RelateUnit2);
		}
		//20160118 mod By Hsieh 將取出的相關單位代碼  名稱 以  id_name顯示
		if(i==0){
			document.getElementById("txtAddSales").value = tArr[i][1]+"_"+tArr[i][2];
		}else{
			document.getElementById("txtAddSales").value += "\n"+tArr[i][1]+"_"+tArr[i][2];
		}
		//document.getElementById("txtAddSales").value += tArr[i][2];
	}
}
*/
//尋找可變更的文件
function Button_ChooseNo_onclick() {
	//將Link由../../../GP/WMS/ 改為 /NaNaWeb/GP/WMS/ SINCE : NANA5.5.2 MODI BY 4182 IN 20121220
	openDialog("/NaNaWeb/GP/WMS/ManageDocument/CreateDocument?hdnMethod=chooseModifyDoc&returnField=HdnTextbox_DocOID", "500", "300", "titlebar,scrollbars,status,resizable");
	//var docOID=document.getElementById("HdnTextbox_DocOID").value;

}

function Textbox_DocNo_onchange() {

	var docOID=eval(document.getElementById("HdnTextbox_DocOID").value);
	if(activityId == "Requester"){
		//DWREngine.setAsync(false);//開啟Ajax同步
		//alert(docOID[0][0]);
		ajax_IsoModuleAccessor.getDocumentDTOByOID(docOID[0][0],false,"Last",loadDocReq);
		//DWREngine.setAsync(true);//開啟Ajax同步
		//需要帶出文件類別Grid的值，否則ISODocManager跑不下去		
		ajax_IsoModuleAccessor.getDocumentDTOByOID(docOID[0][0],false,"Last",loadDocCate);
		
	}else if(activityId == "ModDocRequester"){
		//alert("2");
		DWREngine.setAsync(false);//開啟Ajax同步
		ajax_IsoModuleAccessor.getDocumentDTOByOID(docOID[0][0],true,"Last",loadDocMod);
		DWREngine.setAsync(true);//開啟Ajax同步
		
		
	}
	
	
}

function loadDocReq(data) {
	document.getElementById("Textbox_DocNo").value = data.cmItemId; //文件編號
	document.getElementById("Textbox_VerNoOld").value = data.document.displayVersion; //版號
	document.getElementById("Textbox_DocName").value = data.document.name; //文件名稱
	document.getElementById("Textbox_InvNodDays").value = data.invNodDays; //失效提前通知日
	document.getElementById("TextArea_DocAbstract").value = data.document.description; //文件摘要
	document.getElementById("Dropdown_FrameUnits").value = data.document.creatUnitType; //制定單位
	document.getElementById("HdnTextbox_FrameUnit").value = data.document.creatUnitOID;
	document.getElementById("Textbox_FrameUnitNo").value = data.document.creatUnitId;
	document.getElementById("Textbox_FrameUnitName").value = data.document.creatUnitName;
	document.getElementById("Dropdown_KeepingUnits").value = data.document.rsrvUnitType; //保管單位
	document.getElementById("HdnTextbox_KeepingUnit").value = data.document.rsrvUnitOID;
	document.getElementById("Textbox_KeepingUnitNo").value = data.document.rsrvUnitId;
	document.getElementById("Textbox_KeepingUnitName").value = data.document.rsrvUnitName;	
	document.getElementById("InputLabel_Author_txt").value = data.document.authorId; //文件製作者
	document.getElementById("InputLabel_Author_lbl").value = data.document.authorName;
	document.getElementById("Textbox_ConserveYear").value = data.document.rsrvYear; //保存年限
	document.getElementById("Date_SetDate_txt").value = data.document.createdTimeLabel; //製作日期
	document.getElementById("Date_EffectDate_txt").value = data.document.validFromLabel; //生效日期
	document.getElementById("Date_DeadDate_txt").value = data.document.validToLabel; //失效日期
	document.getElementById("Date_ConserveDate_txt").value = data.document.rsrvToLabel; //保存到期日
	document.getElementById("Time_LimitReadFrom").value = data.startReadTimeLabel; //閱讀時間限制
	document.getElementById("Time_LimitReadTo").value = data.endReadTimeLabel;
	
	document.getElementById("Textbox_ReadTime").value = data.hoursOfReadable; //可閱讀時數
}

function loadDocMod(data) {

	//alert(DWRUtil.toDescriptiveString(data.document.deployedUnits, 2));
	document.getElementById("Hdn_PowerLevel").value = data.securityLevelOID; //機密等級
	document.getElementById("Dropdown_PowerLevel").value = data.securityLevelOID;
	//審閱設定
	document.getElementById("ddlVettingUnitType").value = data.document.vettingUnitType; //審閱部門型態
	if (data.document.vettingUnitId != null && data.document.vettingUnitId != 'null') document.getElementById("txtVettingUnitID").value = data.document.vettingUnitId; //審閱部門ID
	if (data.document.vettingUnitName != null && data.document.vettingUnitName != 'null') document.getElementById("txtVettingUnitName").value = data.document.vettingUnitName; //審閱部門NAME
	if (data.document.vettingUnitOID != null && data.document.vettingUnitOID != 'null') document.getElementById("hdnVettingUnitOID").value = data.document.vettingUnitOID; //審閱部門OID
	document.getElementById("txtPeriod").value = data.document.vettingPeriod; //審閱週期
	document.getElementById("txtVettingNoticeDay").value = data.document.vettingNoticeDay; //審閱提前通知日
	document.getElementById("hdnVettingFrome").value = data.document.vettingFromLabel; //審閱日

	gISOTypeData = "";
	gDocCategoryData = "";
	gDocServerData = "";
	gReferDocData = "";
	gIssueUnitData = "";
	gRelateUnitData = "";
	gPowerData = "";
	gClauseData = "";
	gUpperDocData = "";
	gLowerDocData = "";
	gFilePolicyData = ""; //20130103 Tiffany
	//文件條文
	if (data.document.docClauses != null) {
		var tClauseNo = data.document.docClauseNo.split(",");
		var tClauseName = data.document.docClauseNames.split(",");
		var hdnTextBoxISOClause = "";
		for (var i = 0; i < data.document.docClauses.length; i++) {
			gClauseData = gClauseData + "['" + data.document.docClauses[i].OID + "','" + tClauseNo[i] + "-" + tClauseName[i] + "','" + data.document.docClauses[i].typeName + "'],";
			hdnTextBoxISOClause = hdnTextBoxISOClause + "['" + data.document.docClauses[i].OID + "','" + tClauseNo[i] + "','" + tClauseName[i] + "','" + data.document.docClauses[i].typeName + "'],";
		}
		gClauseData = "[" + gClauseData.substring(0, gClauseData.length - 1) + "]";
		hdnTextBoxISOClause = "[" + hdnTextBoxISOClause.substring(0, hdnTextBoxISOClause.length - 1) + "]";
		Grid_ISOClauseObj.reload(eval(gClauseData));
		document.getElementById("Grid_ISOClause").value = Grid_ISOClauseObj.toArrayString();
		document.getElementById("HdnTextbox_ISOClause").value = hdnTextBoxISOClause;
	}
	
	//文件型態階層
	if (data.docLevels != null) {
		var hdnTextBoxISOType = "";
		for (var i = 0; i < data.docLevels.length; i++) {
			hdnTextBoxISOType = hdnTextBoxISOType + "['" + data.docLevels[i].OID + "','" + data.docLevels[i].name + "','" + data.docLevels[i].isoDocTpypeOID + "'],"; //新增取出TypeOID(For 條文開窗用)
			gISOTypeData = gISOTypeData + "['" + data.docLevels[i].OID + "','" + data.docLevels[i].name + "','" + data.docLevels[i].isoDocTpypeOID + "'],"; //bug 補上TypeOID by Tiffany 20130422
		}
		gISOTypeData = "[" + gISOTypeData.substring(0, gISOTypeData.length - 1) + "]";
		hdnTextBoxISOType = "[" + hdnTextBoxISOType.substring(0, hdnTextBoxISOType.length - 1) + "]";
		Grid_ISOTypeObj.reload(eval(gISOTypeData));
		document.getElementById("Grid_ISOType").value = Grid_ISOTypeObj.toArrayString();
		document.getElementById("HdnTextbox_ISOType").value = hdnTextBoxISOType;
	}

	//文件類別
	//alert('before doc');
	if (data.categories != null) {
	//alert('in doc');
		var categoryNames = data.categoryNames;
		var categoryName = categoryNames.split(",");
		for (var i = 0; i < data.categories.length; i++) {
			var sql = "select categoryName from DocCategory where OID = '" + data.categories[i].OID + "'";
			var rs = tEFGPConn.query(sql);
			var catName = "";
			if (rs.length > 0) {
				catName = rs[0][0];
			}
			gDocCategoryData = gDocCategoryData + "['" + data.categories[i].OID + "','" + categoryName[i] + "','" + catName + "'],";
		}
		gDocCategoryData = "[" + gDocCategoryData.substring(0, gDocCategoryData.length - 1) + "]";
		Grid_DocCategoryObj.reload(eval(gDocCategoryData));
		document.getElementById("Grid_DocCategory").value = Grid_DocCategoryObj.toArrayString();
		//alert('Grid_DocCategory:'+document.getElementById("Grid_DocCategory").value);
		document.getElementById("HdnTextbox_DocCategory").value = gDocCategoryData;
		
	}
	
	//20160310 add By Hsieh 加入文件類別所對應的發行腳色
	var tData= Grid_DocCategoryObj.getData();
	var tsql ="select distinct Org.organizationName, RD.roleDefinitionName, RU.roleDefOID "+
			 "from RoleDefinition RD, CustISODocCate_ReleaseUnits RU, Organization Org " +
			 "where RD.OID = RU.roleDefOID and Org.OID = RD.organizationOID "+
			 "and RU.DocCateOID = '" + tData[0][0] + "'";
	var trs = tEFGPConn.query(tsql);
	var tTextbox_RoleName="";
	var troleDefOID="";
	//alert(tsql);
	if (trs.length > 0) {
		tTextbox_RoleName = trs[0][0]+"_"+trs[0][1];
		troleDefOID=trs[0][2];
	}
	document.getElementById("Textbox_RoleName").value = tTextbox_RoleName;
	document.getElementById("HdnTextbox_RoleOID").value = troleDefOID;
	
	//是否轉pdf
	var tRequiredToConvertPDF = data.document.requiredToConvertPDF;
	if (tRequiredToConvertPDF == false) {
		document.getElementById("Checkbox_IsConvertPDF_1").checked = true;
	} else {
		document.getElementById("Checkbox_IsConvertPDF_0").checked = true;
	}

	//pdf檔案安全性類型
	var tPDFSecurityType = data.document.pdfFileSecurityType;
	if (tPDFSecurityType == "HIGH_SECURITY") {
		document.getElementById("PDFFileSecurity_0").checked = true;
	} else if (tPDFSecurityType == "MEDIUM_SECURITY") {
		document.getElementById("PDFFileSecurity_1").checked = true;
	} else if (tPDFSecurityType == "LOW_SECURITY") {
		document.getElementById("PDFFileSecurity_2").checked = true;
	}

	//文件伺服器
	if (data.document.deployedDocServers != null) {
		for (var i = 0; i < data.document.deployedDocServers.length; i++) {
			gDocServerData = gDocServerData + "['" + data.document.deployedDocServers[i].OID + "','" + data.document.deployedDocServers[i].id + "','" + data.document.deployedDocServers[i].docServerAddress + "'],";
		}
		gDocServerData = "[" + gDocServerData.substring(0, gDocServerData.length - 1) + "]";
		Grid_DocServerObj.reload(eval(gDocServerData));
		document.getElementById("Grid_DocServer").value = Grid_DocServerObj.toArrayString();
		document.getElementById("HdnTextbox_DocServer").value = gDocServerData;
	}

	//參考文件
	if (data.refDocs != null) {
		for (var i = 0; i < data.refDocs.length; i++) {

			gReferDocData = gReferDocData + "['" + data.refDocs[i].OID + "','" + data.refDocs[i].id + "','" + data.refDocs[i].name + "','" + data.refDocs[i].displayVersion + "'],";
		}

		gReferDocData = "[" + gReferDocData.substring(0, gReferDocData.length - 1) + "]";
		Grid_ReferDocObj.reload(eval(gReferDocData));
		document.getElementById("Grid_ReferDoc").value = Grid_ReferDocObj.toArrayString();
		document.getElementById("HdnTextbox_ReferDoc").value = gReferDocData;
	}

	//上階文件
	if (data.document.upperDocs != null) {
		for (var i = 0; i < data.document.upperDocs.length; i++) {

			gUpperDocData = gUpperDocData + "['" + data.document.upperDocs[i].containerOID + "','" + data.document.upperDocs[i].id + "','" + data.document.upperDocs[i].name + "','" + data.document.upperDocs[i].displayVersion + "','" + data.document.upperDocs[i].OID + "','" + data.document.upperDocs[i].version + "'],";
		}
		gUpperDocData = "[" + gUpperDocData.substring(0, gUpperDocData.length - 1) + "]";

		Grid_UpperDocObj.reload(eval(gUpperDocData));
		document.getElementById("Grid_UpperDoc").value = Grid_UpperDocObj.toArrayString();
		document.getElementById("HdnTextbox_UpperDoc").value = gUpperDocData;

	}

	//下階文件
	if (data.document.lowerDocs != null) {
		for (var i = 0; i < data.document.lowerDocs.length; i++) {

			gLowerDocData = gLowerDocData + "['" + data.document.lowerDocs[i].containerOID + "','" + data.document.lowerDocs[i].id + "','" + data.document.lowerDocs[i].name + "','" + data.document.lowerDocs[i].displayVersion + "','" + data.document.lowerDocs[i].OID + "','" + data.document.lowerDocs[i].version + "'],";
		}
		gLowerDocData = "[" + gLowerDocData.substring(0, gLowerDocData.length - 1) + "]";

		Grid_LowerDocObj.reload(eval(gLowerDocData));
		document.getElementById("Grid_LowerDoc").value = Grid_LowerDocObj.toArrayString();

	}
	//發行單位 
	//20160119 mod by Hsieh 加上類型  與  發佈對象
	//20160310 mod by Hsieh 調整回產品
	/*
	if (data.document.deployedUnits != null) {
		//alert("data.document.deployedUnits="+objToString(data.document.deployedUnits[0]));
		var tType="1";
		for (var i = 0; i < data.document.deployedUnits.length; i++) {
			gIssueUnitData = gIssueUnitData + "['" + data.document.deployedUnits[i].OID + "','" + data.document.deployedUnits[i].id + "','" + data.document.deployedUnits[i].name+ "','" +tType + "','" + data.document.deployedUnits[i].roleOID + "','" + data.document.deployedUnits[i].roleName + "','" + findDeptManagerByOID(data.document.deployedUnits[i].OID) +"'],";
			//gIssueUnitData = gIssueUnitData + "['" + data.document.deployedUnits[i].OID + "','" + data.document.deployedUnits[i].id + "','" + data.document.deployedUnits[i].name+ "','" +data.document.deployedUnits[i].type + "','" + data.document.deployedUnits[i].roleOID + "','" + data.document.deployedUnits[i].roleName + "','" + data.document.deployedUnits[i].id+";" +"'],";
			
		}
		
		for (var i = 0; i < data.document.deployedUsers.length; i++) {
			document.getElementById("HdnTextbox_Issue").value = document.getElementById("HdnTextbox_Issue").value + data.document.deployedUsers[i].id + ";";
		}
		
		gIssueUnitData = "[" + gIssueUnitData.substring(0, gIssueUnitData.length - 1) + "]";
		Grid_IssueUnitObj.reload(eval(gIssueUnitData));
		document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString(); //eval(gIssueUnitData);
		
	}
	*/
	var tGridDataIssueUnit = [];
	Grid_IssueUnitObj.reload(eval(tGridDataIssueUnit));
	document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
	afterSaveGrid_IssueUnit();
	//20160318 add 將表單欄位寫入 Grid_RelateUnit_EFGP 且 Grid_RelateUnit要隱藏
	//會簽單位
	//if (data.document.relatedUnits != null) {
	var tGridDataRelateUnit = [];
	Grid_RelateUnitObj.reload(eval(tGridDataRelateUnit));
	document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();
	afterSaveGrid_RelateUnit();		
				
	var tGridId = Grid_RelateUnitObj.getId();
	var tGridElement = document.getElementById(tGridId);
	tGridElement.style.display = "none";
		
		//Grid_RelateUnit_EFGP
		Grid_RelateUnit_EFGPObj.reload(eval(document.getElementById("Grid_RelateUnit").value));
		document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString();
		
		/* 20160323 mod By Hsieh 會簽單位人員 改用  變更文件類別的方式取值
		//改用SQL撈取資料				
		var tSql = "select distinct RelateUnitId, RelateUnitName, RelateUnitType, RelateUnitOid, RelateUsers "+
				   "from ISOMod001_Grid_RelateUnit_EFGP ISOMod, ISOMod001 ISOM, ProcessInstance PI, Documents Doc, ISODocCmItem Cm  "+
				   "where ISOMod.formSerialNumber = ISOM.formSerialNumber and ISOM.processSerialNumber = PI.serialNumber "+
				   "and Doc.docNo = ISOM.Textbox_DocNo and Doc.containerOID = Cm.OID "+
				   "and ISOM.Textbox_DocNo ='"+document.getElementById("Textbox_DocNo").value+"' and Cm.releasedVersion ='"+document.getElementById("Textbox_VerNoOld").value+"' ";
		var trs = tEFGPConn.query(tSql);
		//alert(tSql);
		if (trs.length > 0) {
			for (var i = 0; i < trs.length; i++) {
				gRelateUnitData = gRelateUnitData + "['" + trs[i][0]+ "','" + trs[i][1] + "','" + trs[i][2] + "','" + trs[i][3] + "','"+trs[i][4]+"'],";
				document.getElementById("HdnTextbox_RelatedDep").value = document.getElementById("HdnTextbox_RelatedDep").value + trs[i][0] + ";";
			}
			gRelateUnitData = "[" + gRelateUnitData.substring(0, gRelateUnitData.length - 1) + "]";
			Grid_RelateUnitObj.reload(eval(gRelateUnitData));
			document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString(); //	eval(gRelateUnitData);
		
			var tGridId = Grid_RelateUnitObj.getId();
			var tGridElement = document.getElementById(tGridId);
			tGridElement.style.display = "none";
		
			//Grid_RelateUnit_EFGP
			Grid_RelateUnit_EFGPObj.reload(eval(gRelateUnitData));
			document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString(); //	eval(gRelateUnitData);
		} else{		
			var tSql = "select distinct RelateUnitId, RelateUnitName, RelateUnitType, RelateUnitOid ,RelateUsers"+
					   "from  ISONew001_Grid_RelateUnit_EFGP ISONew, ISONew001 ISON, ProcessInstance PI, Documents Doc, ISODocCmItem Cm "+
				       "where ISONew.formSerialNumber = ISON.formSerialNumber and  ISON.processSerialNumber = PI.serialNumber and PI.serialNumber = Doc.refProcessInstanceSN "+
					   "and Doc.containerOID = Cm.OID "+
				       "and ISON.Textbox_DocNo ='"+document.getElementById("Textbox_DocNo").value+"' and Cm.releasedVersion ='"+document.getElementById("Textbox_VerNoOld").value+"' ";
			var trs = tEFGPConn.query(tSql);
			if (trs.length > 0) {
				for (var i = 0; i < trs.length; i++) {
					gRelateUnitData = gRelateUnitData + "['" + trs[i][0]+ "','" + trs[i][1] + "','" + trs[i][2] + "','" + trs[i][3] + "','"+trs[i][4]+"'],";
					document.getElementById("HdnTextbox_RelatedDep").value = document.getElementById("HdnTextbox_RelatedDep").value + trs[i][0] + ";";
				}
				gRelateUnitData = "[" + gRelateUnitData.substring(0, gRelateUnitData.length - 1) + "]";
				Grid_RelateUnitObj.reload(eval(gRelateUnitData));
				document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString(); //	eval(gRelateUnitData);
		
				var tGridId = Grid_RelateUnitObj.getId();
				var tGridElement = document.getElementById(tGridId);
				tGridElement.style.display = "none";
		
				//Grid_RelateUnit_EFGP
				Grid_RelateUnit_EFGPObj.reload(eval(gRelateUnitData));
				document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString(); //	eval(gRelateUnitData);
			}
		}
		*/		
	//}

	//權限屬性
	if (data.accessRights != null) {
		for (var i = 0; i < data.accessRights.length; i++) {
			gPowerData = gPowerData + "['" + data.accessRights[i].name + "','" + data.accessRights[i].OID + "'],";
		}
		gPowerData = "[" + gPowerData.substring(0, gPowerData.length - 1) + "]";
		Grid_PowerObj.reload(eval(gPowerData));
		document.getElementById("Grid_Power").value = Grid_PowerObj.toArrayString();
	}

	//20130103 Tiffany 附件政策
	// if(data.attTemplates!=null){
	// 	for(var i=0;i<data.attTemplates.length;i++){
	// 		gFilePolicyData=gFilePolicyData+"['"+data.attTemplates[i].OID+"','"+data.attTemplates[i].policyId+"','"+data.attTemplates[i].policyName+"','"+data.attTemplates[i].authority+"'],";
	// 	}
	// 	gFilePolicyData="["+gFilePolicyData.substring(0,gFilePolicyData.length-1)+"]";
	// 	Grid_FilePolicyObj.reload(eval(gFilePolicyData));
	// 	document.getElementById("Grid_FilePolicy").value = Grid_FilePolicyObj.toArrayString();
	// }
	//if (document.getElementById("btnCompleteForm") != null) {
		saveTempForm(); //載入附件
	//}

}
//找到部門主管
function findDeptManagerByOID(pUnitOID){
	var tManagerId="";
	var sql2 = "select U.id from Users U, OrganizationUnit O where O.managerOID = U.OID and O.OID = '" + pUnitOID + "'";
	var rs2 = tEFGPConn.query(sql2);
	if (rs2.length > 0) {
		tManagerId = rs2[0][0] + ";";
	}
	return  tManagerId;
}
var tGroupMenbers="";
//找到群組人員
function findGroupMenbersByOID(pUnitOID){
	DWREngine.setAsync(false);
	ajax_OrgAccessor.findGroupByOID(pUnitOID, loadGroupUser);
	DWREngine.setAsync(true);
	return  tGroupMenbers;
	
}
function loadGroupUser(data){
	for (var i = 0; i < data.members.length; i++) {
		tGroupMenbers = allRelatedUsers + data.members[i].id + ";";
	}
}
//找到人員
function findUser(data){


}


function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
}


function loadDocCate(data) {
	//文件類別
	//alert(DWRUtil.toDescriptiveString(data,2));//看物件內容
	//alert('before doc');
	if (data.categories != null) {
	//alert('in doc');
	gDocCategoryData="";
		var categoryNames = data.categoryNames;
		var categoryName = categoryNames.split(",");
		for (var i = 0; i < data.categories.length; i++) {
			var sql = "select categoryName from DocCategory where OID = '" + data.categories[i].OID + "'";
			var rs = tEFGPConn.query(sql);
			var catName = "";
			if (rs.length > 0) {
				catName = rs[0][0];
			}
			gDocCategoryData = gDocCategoryData + "['" + data.categories[i].OID + "','" + categoryName[i] + "','" + catName + "'],";
		}
		
		gDocCategoryData = "[" + gDocCategoryData.substring(0, gDocCategoryData.length - 1) + "]";
		Grid_DocCategoryObj.reload(eval(gDocCategoryData));
		
		document.getElementById("Grid_DocCategory").value = Grid_DocCategoryObj.toArrayString();
		//alert('Grid_DocCategory:'+document.getElementById("Grid_DocCategory").value);
		document.getElementById("HdnTextbox_DocCategory").value = gDocCategoryData;
		//20160118 add by Hsieh 帶入資料後隱藏
		var tGridId = Grid_DocCategoryObj.getId();
		var tGridElement = document.getElementById(tGridId);
		tGridElement.style.display = "none";
	}
}

//設定制定單位&保管單位的開窗
function Button_FrameUnit_onclick() {
	chooseInputLabel_Unit("Dropdown_FrameUnits");
}

function Button_KeepingUnit_onclick() {
	chooseInputLabel_Unit("Dropdown_KeepingUnits");
}

var memberList = new Array;
//單選開窗
function chooseInputLabel_Unit(unitfor) {
	var unitforValue = document.getElementById(unitfor).value;

	if (unitforValue == 1) {
		openDataChooser("Department", "single", "null", "memberList", "addInputLabel_Unit(" + "'" + unitfor + "'" + ")");
	} else if (unitforValue == 2) {
		openDataChooser("Project", "single", "null", "memberList", "addInputLabel_Unit(" + "'" + unitfor + "'" + ")");
	} else if (unitforValue == 3) {
		openDataChooser("Group", "single", "null", "memberList", "addInputLabel_Unit(" + "'" + unitfor + "'" + ")");
	} else if (unitfor == "Dropdown_QCUnits") {
		openDataChooser("User", "single", "null", "memberList", "addInputLabel_Unit(" + "'" + unitfor + "'" + ")");
	}	
}

//多選開窗
function chooseInputLabels_Unit(unitfor) {
	var unitforValue = document.getElementById(unitfor).value;

	if (unitforValue == 1) {
		openDataChooser("Department", "multiple", "null", "memberList", "addInputLabel_Unit(" + "'" + unitfor + "'" + ")");
	} else if (unitforValue == 2) {
		openDataChooser("Project", "multiple", "null", "memberList", "addInputLabel_Unit(" + "'" + unitfor + "'" + ")");
	} else if (unitforValue == 3) {
		openDataChooser("Group", "multiple", "null", "memberList", "addInputLabel_Unit(" + "'" + unitfor + "'" + ")");
	} else if (unitforValue == 4) {
		openDataChooser("User", "multiple", null, "memberList", "addInputLabel_Unit(" + "'" + unitfor + "'" + ")");
	} else if (unitfor == "Textbox_RoleName") {
		openDataChooser("Role", "single", null, "memberList", "addInputLabel_Unit(" + "'" + unitfor + "'" + ")");
	} else if(unitfor == "hdnAddSales"){
		openDataChooser("Group", "multiple", "groupName%業務部", "memberList", "addInputLabel_Unit(" + "'" + unitfor + "'" + ")");
	}
}

function addInputLabel_Unit(unitfor) {
	var tNewValue = "";
	var tName = "";
	var tHiddenValue = "";

	var vInputLabel = null;
	var unitforValue = document.getElementById(unitfor).value;
	vInputLabel = memberList;

	if (vInputLabel != null) {
		if (typeof(vInputLabel.OrgId) != "undefined") {
			if (vInputLabel.OrgId != null && vInputLabel.OrgId != "") {
				tNewValue = tNewValue + "[" + vInputLabel.OrgId + "]";
			}
		}
		if (typeof(vInputLabel.Id) != "undefined") {
			if (vInputLabel.Id != null && vInputLabel.Id != "") {
				tNewValue = tNewValue + vInputLabel.Id;
			}
		}
		tName = vInputLabel.Name;

		if (typeof(vInputLabel.OID) != "undefined") {
			if (vInputLabel.OID != null && vInputLabel.OID != "") {
				tHiddenValue = vInputLabel.OID;
			}
		}
	}

	if (unitfor == "Dropdown_FrameUnits") {
		document.getElementById("Textbox_FrameUnitNo").value = tNewValue;
		document.getElementById("HdnTextbox_FrameUnit").value = tHiddenValue;
		document.getElementById("Textbox_FrameUnitName").value = tName;
	} else if (unitfor == "ddlVettingUnitType") {
		//新增審閱單位相關項目 SINCE : NANA5.5.2 MODI BY 4182 IN 20130218
		document.getElementById("txtVettingUnitID").value = tNewValue;
		document.getElementById("txtVettingUnitName").value = tName;
		document.getElementById("hdnVettingUnitOID").value = tHiddenValue;
	} else if (unitfor == "Dropdown_KeepingUnits") {
		document.getElementById("Textbox_KeepingUnitNo").value = tNewValue;
		document.getElementById("HdnTextbox_KeepingUnit").value = tHiddenValue;
		document.getElementById("Textbox_KeepingUnitName").value = tName;
	} else if (unitfor == "Dropdown_IssueUnits") {
		if (memberList != null) {
			for (var i = 0; i < memberList.length; i++) {
				tNewValue = "";
				if (typeof(memberList[i].OrgId) != "undefined") {
					if (memberList[i].OrgId != null && memberList[i].OrgId != "") {
						tNewValue = "[" + memberList[i].OrgId + "]";
					}
				}
				if (typeof(memberList[i].Id) != "undefined") {
					if (memberList[i].Id != null && memberList[i].Id != "") {
						tNewValue = tNewValue + memberList[i].Id;
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
	} else if (unitfor == "Dropdown_RelatedUnits") {
		if (memberList != null) {
			for (var i = 0; i < memberList.length; i++) {
				tNewValue = "";
				if (typeof(memberList[i].OrgId) != "undefined") {
					if (memberList[i].OrgId != null && memberList[i].OrgId != "") {
						tNewValue = "[" + memberList[i].OrgId + "]";
					}
				}
				if (typeof(memberList[i].Id) != "undefined") {
					if (memberList[i].Id != null && memberList[i].Id != "") {
						tNewValue = tNewValue + memberList[i].Id;
					}
				}
				tName = memberList[i].Name;
				tHiddenValue = memberList[i].OID;
				document.getElementById("Textbox_RelatedUnitNo").value = tNewValue;
				document.getElementById("HdnTextbox_RelatedUnit").value = tHiddenValue;
				document.getElementById("Textbox_RelatedUnitName").value = tName;
				//將選取結果放至Grid中
				Button_AddUnit_onclick();
			}
		}
		Grid_RelateUnitObj.clearBinding();
		document.getElementById("Dropdown_RelatedUnits").value = 1;
	} else if (unitfor == "Dropdown_QCUnits") {
		if (memberList != null) {
			//alert(memberList.length);
			document.getElementById("txtAddQC").value = tNewValue;
			document.getElementById("HdnTextbox_QCMan").value = tHiddenValue;
			//alert(tHiddenValue);
			document.getElementById("txtAddQCName").value = tName;
			Button_AddUnit_onclick1();
			//alert(document.getElementById("HdnTextbox_QCMan").value);
			/*
			for (var i = 0; i < memberList.length; i++) {
				tNewValue = "";
				if (typeof(memberList[i].OrgId) != "undefined") {
					if (memberList[i].OrgId != null && memberList[i].OrgId != "") {
						tNewValue = "[" + memberList[i].OrgId + "]";
					}
				}
				if (typeof(memberList[i].Id) != "undefined") {
					if (memberList[i].Id != null && memberList[i].Id != "") {
						tNewValue = tNewValue + memberList[i].Id;
					}
				}
				tName = memberList[i].Name;
				tHiddenValue = memberList[i].OID;
				
				//將選取結果放至Grid中
				
			}
			*/
		}
		//Grid_RelateUnitObj.clearBinding();
		//document.getElementById("Dropdown_QCUnits").value = 1;
	} else if (unitfor == "Textbox_RoleName") {
		document.getElementById("HdnTextbox_RoleOID").value = tHiddenValue;
		tName = tName.replace("[", "");
		tName = tName.replace("]", "_");
		document.getElementById("Textbox_RoleName").value = tName;
	} else if(unitfor == "hdnAddSales"){
		if(memberList != null){
			document.getElementById("txtAddSales").value="";
			//document.getElementById("hdnAddSales").value = memberList.;
			//var tArr = memberList;
			if(memberList.length>0){
				for (var i = 0; i < memberList.length; i++) {
					//20160118 mod By Hsieh 將取出的相關單位代碼  名稱 以  id_name顯示
					if(i==0){
						document.getElementById("txtAddSales").value = memberList[i].Id+"_"+memberList[i].Name;
					}else{
						document.getElementById("txtAddSales").value += "\n"+memberList[i].Id+"_"+memberList[i].Name;
					}
					//document.getElementById("txtAddSales").value += tArr[i][2];
		
				}
			}
		}
		
		
	}

	memberList = new Array();
}

/* 判斷是否填入數字
function Textbox_ReadTime_onchange(){
	checkIfNum("Textbox_ReadTime","可閱讀時數");
} */

/* function Textbox_ConserveYear_onchange(){
	if(document.getElementById("Textbox_ConserveYear").value !="" && checkIfNum("Textbox_ConserveYear","保存年限")){
		setConserveDate();
	}else{
		document.getElementById("Date_ConserveDate_txt").value="";
	}
}  */
function checkIfNum(textId, textname) {
	var textVar = document.getElementById(textId).value;
	if (isNaN(textVar)) {
		alert(textname + "請填入數字!");
		document.getElementById(textId).focus();
		return false;
	}
	return true;
}
/* function Date_SetDate_onchange(){
	Textbox_ConserveYear_onchange();
}	 */
function setConserveDate() { //自動計算保存到期日
	var tDate = document.getElementById("Date_SetDate_txt").value;
	setDate = new Date(document.getElementById("Date_SetDate_txt").value);
	//conserveYear=parseFloat(document.getElementById("Textbox_ConserveYear").value);
	//conservedays=eval(conserveYear)*31536000000; //*1000*60*60*24*365
	//conserveDate=new Date(setDate.getTime()+conservedays);
	//document.getElementById("Date_ConserveDate_txt").value=conserveDate.getYear()+"/"+newdate(conserveDate.getMonth()+1)+"/"+newdate(conserveDate.getDate());
	//因javaScript new Date物件沒有判斷閏年的功能故移到AJAX由java Calendar物件處理 Bernice KUO add 2011/12/27
	ajax_IsoModuleAccessor.countConserveDate(conserveYear, tDate, getConserveDate);
}

function getConserveDate(data) {
	document.getElementById("Date_ConserveDate_txt").value = data;
}
function newdate(a) {
	if (a < 10) {
		a = "0" + a;
	}
	return a;
}

function Dropdown_PowerLevel_onchange() { //儲存機密等級
	document.getElementById("Hdn_PowerLevel").value = document.getElementById("Dropdown_PowerLevel").value;
}

//設定ISO型態&文件階層
function Button_ISOTypeAdd_onclick() {
	//將Link由../../../GP/WMS/ 改為 /NaNaWeb/GP/WMS/ SINCE : NANA5.5.2 MODI BY 4182 IN 20121220
	openDialog("/NaNaWeb/GP/WMS/ManageDocument/CreateDocument?hdnMethod=chooseDocLevel&returnField=HdnTextbox_ISOType", "400", "300", "titlebar,scrollbars,status,resizable");

}
function updateSelectedLevelList() {
	var tHdnData = document.getElementById("HdnTextbox_ISOType").value;
	if (tHdnData == "") {
		tHdnData = [];
	}
	Grid_ISOTypeObj.reload(eval(tHdnData));
	document.getElementById("Grid_ISOType").value = Grid_ISOTypeObj.toArrayString();

}

function Dropdown_defaultISOType_onchange() { //儲存編碼預設值
	document.getElementById("Hdn_defaultISOType").value = document.getElementById("Dropdown_defaultISOType").value;
}
function Dropdown_defaultCategory_onchange() { //儲存編碼預設值
	document.getElementById("Hdn_defaultCategory").value = document.getElementById("Dropdown_defaultCategory").value;
}

//選擇文件類別
var tGrid_DocCategoryOriginalData="";
function Button_DocCategory_onclick() {
	tGrid_DocCategoryOriginalData="";
	tGrid_DocCategoryOriginalData=document.getElementById("HdnTextbox_DocCategory").value;
	//將Link由../../../GP/WMS/ 改為 /NaNaWeb/GP/WMS/ SINCE : NANA5.5.2 MODI BY 4182 IN 20121220
	openDialog("/NaNaWeb/GP/WMS/ManageDocument/CreateDocument?hdnMethod=chooseDocCategory&returnField=HdnTextbox_DocCategory&returnRule=Dropdown_defaultCategory", "400", "300", "titlebar,scrollbars,status,resizable");

}
function updateSelectedCategoryList() {
	var tHdnData = document.getElementById("HdnTextbox_DocCategory").value;
	if (tHdnData == "") {
		tHdnData = [];
	}
	Grid_DocCategoryObj.reload(eval(tHdnData));
	var grdDocCategoryData = Grid_DocCategoryObj.getData();
	if (grdDocCategoryData.length > 0) {
		for (var i = 0; i < grdDocCategoryData.length; i++) {
			if (grdDocCategoryData[i][0] != "") {
				var sql = "select categoryName from DocCategory where OID = '" + grdDocCategoryData[i][0] + "'";
				var rs = tEFGPConn.query(sql);
				if (rs.length > 0) {
					grdDocCategoryData[i][2] = rs[0][0];
				} else {
					grdDocCategoryData[i][2] = "";
				}
			}
		}
	}
	document.getElementById("Grid_DocCategory").value = Grid_DocCategoryObj.toArrayString();
	gData = document.getElementById("Grid_DocCategory").value;
	if (gData.length > 1) {
		if (typeof(Grid_DocCategoryObj) != "undefined") {
			Grid_DocCategoryObj.reload(eval(gData));
		}
	}

	//根据DocCategory表中的值查询IssueUnit、RelateUnit和KeepingUnit
	var tGridDataRec = Grid_DocCategoryObj.getData();//載入的grid
	if(tGrid_DocCategoryOriginalData!="" && tGridDataRec.length>0){		
		var tGridDataRecOrigin=eval(tGrid_DocCategoryOriginalData);//原始grid
		var tSameCount=0;
		if(tGridDataRecOrigin.length==tGridDataRec.length){//若筆數相同則進行檢查
			for(i=0;i<tGridDataRecOrigin.length;i++){
				var tSame="N";
				for(j=0;j<tGridDataRec.length;j++){
					if(tGridDataRecOrigin[i][0]==tGridDataRec[j][0]){
						tSame="Y";
					}
				}
				if(tSame=="Y"){
					tSameCount++;
				}
			}
			//alert("tSameCount"+tSameCount);
			if(tSameCount!=tGridDataRec.length){
				tGridData1 = [];
				Grid_IssueUnitObj.reload(eval(tGridData1));
				document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
				afterSaveGrid_IssueUnit();
				
				tGridData2 = [];
				Grid_RelateUnitObj.reload(eval(tGridData2));
				document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();
				afterSaveGrid_RelateUnit();		
				
				var tGridId = Grid_RelateUnitObj.getId();
				var tGridElement = document.getElementById(tGridId);
				tGridElement.style.display = "none";
		
				//Grid_RelateUnit_EFGP
				Grid_RelateUnit_EFGPObj.reload(eval(document.getElementById("Grid_RelateUnit").value));
				document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString(); //	eval(gRelateUnitData);					
			}
		}else{
			tGridData1 = [];
			Grid_IssueUnitObj.reload(eval(tGridData1));
			document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
			afterSaveGrid_IssueUnit();
			
			tGridData2 = [];
			Grid_RelateUnitObj.reload(eval(tGridData2));
			document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();
			afterSaveGrid_RelateUnit();
			
			var tGridId = Grid_RelateUnitObj.getId();
			var tGridElement = document.getElementById(tGridId);
			tGridElement.style.display = "none";
		
			//Grid_RelateUnit_EFGP
			Grid_RelateUnit_EFGPObj.reload(eval(document.getElementById("Grid_RelateUnit").value));
			document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString(); //	eval(gRelateUnitData);
			
		}
		
	}

	DWREngine.setAsync(false);
	var tGridData = "";
	//var tGridDataRec = Grid_DocCategoryObj.getData();
	if (tGridDataRec.length > 0) {
		tGridData += tGridDataRec[0][0] + ";";
	}
	tGridData = tGridData.substring(0, tGridData.length - 1);
	ajax_get2ndCategoryOID.get2ndCategorybyOID(tGridData, loadKeepingUnitNoData);
	DWREngine.setAsync(true);
}

function loadKeepingUnitNoData(data) {
	var unitid_data = "";
	var groupid_data = "";
	unitid_data = data.substring(data.indexOf("[") + 1, data.indexOf("]"));
	groupid_data = data.substring(data.indexOf("]") + 1, data.indexOf(";"));
	var sql = "select GP.groupName from Groups GP, Organization Org " + "where Org.OID = GP.organizationOID " + "and GP.id = '" + groupid_data + "' and Org.id = '" + unitid_data + "'";
	var rs = tEFGPConn.query(sql);
	if (rs.length > 0) {
		document.getElementById("Textbox_KeepingUnitNo").value = groupid_data;
		document.getElementById("Textbox_KeepingUnitName").value = rs[0][0];
	}
}

//設定DocServer
function Btn_DocServerAdd_onclick() {
	//將Link由../../../GP/WMS/ 改為 /NaNaWeb/GP/WMS/ SINCE : NANA5.5.2 MODI BY 4182 IN 20121220
	openDialog("/NaNaWeb/GP/WMS/ManageDocument/CreateDocument?hdnMethod=chooseDocServer&returnField=HdnTextbox_DocServer", "400", "300", "titlebar,scrollbars,status,resizable");

}
function updateSelectedDocServers() {
	var tHdnData = document.getElementById("HdnTextbox_DocServer").value;
	if (tHdnData == "") {
		tHdnData = [];
	}
	Grid_DocServerObj.reload(eval(tHdnData));
	document.getElementById("Grid_DocServer").value = Grid_DocServerObj.toArrayString();
}

//選擇參考文件
function Button_ChooseReferDoc_onclick() {
	isUpperDoc = 0;
	//將Link由../../../GP/WMS/ 改為 /NaNaWeb/GP/WMS/ SINCE : NANA5.5.2 MODI BY 4182 IN 20121220
	openDialog("/NaNaWeb/GP/WMS/ManageDocument/CreateDocument?hdnMethod=chooseReferenceDoc&returnField=HdnTextbox_ReferDoc", "600", "500", "titlebar,scrollbars,status,resizable");
}
//選擇關聯文件
function Button_ChooseReleatedDoc_onclick() {
	isUpperDoc = 2;
	//將Link由../../../GP/WMS/ 改為 /NaNaWeb/GP/WMS/ SINCE : NANA5.5.2 MODI BY 4182 IN 20121220
	openDialog("/NaNaWeb/GP/WMS/ManageDocument/CreateDocument?hdnMethod=chooseReferenceDoc&returnField=HdnTextbox_RelatedDoc", "600", "500", "titlebar,scrollbars,status,resizable");
}
//選擇被關聯文件
function Button_ChooseAlReleatedDoc_onclick() {
	isUpperDoc = 3;
	//將Link由../../../GP/WMS/ 改為 /NaNaWeb/GP/WMS/ SINCE : NANA5.5.2 MODI BY 4182 IN 20121220
	openDialog("/NaNaWeb/GP/WMS/ManageDocument/CreateDocument?hdnMethod=chooseReferenceDoc&returnField=HdnTextbox_AlRelatedDoc", "600", "500", "titlebar,scrollbars,status,resizable");
}
//選擇上階文件
function Button_ChooseUpperDoc_onclick() {
	isUpperDoc = 1;
	//將Link由../../../GP/WMS/ 改為 /NaNaWeb/GP/WMS/ SINCE : NANA5.5.2 MODI BY 4182 IN 20121220
	openDialog("/NaNaWeb/GP/WMS/ManageDocument/CreateDocument?hdnMethod=chooseUpperLevelDoc&returnField=HdnTextbox_UpperDoc", "600", "500", "titlebar,scrollbars,status,resizable");
}

function updateSelectedDocumentList() {
	if(activityId=="Requester"){
		//20160108 mode By Hsieh 選擇文件後帶回資料
		Textbox_DocNo_onchange();
	}else{
		if (isUpperDoc == 0) {
		//參考文件
		var tHdnData = eval(document.getElementById("HdnTextbox_ReferDoc").value);
		var tHdnReferDocData = "";
		if (tHdnData == "" || document.getElementById("HdnTextbox_ReferDoc").value == "") {
			tHdnData = [];
		}
		else {
			for (var i = 0; i < tHdnData.length; i++) {
				tHdnReferDocData = tHdnReferDocData + "['" + tHdnData[i][0] + "','" + tHdnData[i][1] + "','" + tHdnData[i][2] + "','" + tHdnData[i][3] + "'],";
			}
			tHdnReferDocData = "[" + tHdnReferDocData.substring(0, tHdnReferDocData.length - 1) + "]";
			tHdnData = tHdnReferDocData;
			Grid_ReferDocObj.reload(eval(tHdnData));
			document.getElementById("Grid_ReferDoc").value = Grid_ReferDocObj.toArrayString();
			document.getElementById("HdnTextbox_ReferDoc").value = Grid_ReferDocObj.toArrayString();
		}
	} else if (isUpperDoc == 1) {
		//上階文件
		var tHdnUpperData = eval(document.getElementById("HdnTextbox_UpperDoc").value);
		var tHdnUpperDocData = "";
		if (tHdnUpperData == "" || document.getElementById("HdnTextbox_UpperDoc").value == "") {
			tHdnUpperData = [];
		} else {
			for (var i = 0; i < tHdnUpperData.length; i++) {
				tHdnUpperDocData = tHdnUpperDocData + "['" + tHdnUpperData[i][0] + "','" + tHdnUpperData[i][1] + "','" + tHdnUpperData[i][2] + "','" + tHdnUpperData[i][3] + "','" + tHdnUpperData[i][4] + "','" + tHdnUpperData[i][5] + "'],";
			}
			tHdnUpperDocData = "[" + tHdnUpperDocData.substring(0, tHdnUpperDocData.length - 1) + "]";
			tHdnUpperData = tHdnUpperDocData;
			Grid_UpperDocObj.reload(eval(tHdnUpperData));
			document.getElementById("Grid_UpperDoc").value = Grid_UpperDocObj.toArrayString();
			document.getElementById("HdnTextbox_UpperDoc").value = Grid_UpperDocObj.toArrayString();
		}
	} else if (isUpperDoc == 2) {
		//關聯文件
		var tHdnRelatedData = eval(document.getElementById("HdnTextbox_RelatedDoc").value);
		var tHdnRelatedDocData = "";
		
		if (tHdnRelatedData == "" || document.getElementById("HdnTextbox_RelatedDoc").value == "") {
			tHdnRelatedData = [];
		} else {
			for (var i = 0; i < tHdnRelatedData.length; i++) {
				tHdnRelatedDocData = tHdnRelatedDocData + "['" + tHdnRelatedData[i][0] + "','" + tHdnRelatedData[i][1] + "','" + tHdnRelatedData[i][2] + "','" + tHdnRelatedData[i][3] + "','',''],";
			}
			tHdnRelatedDocData = "[" + tHdnRelatedDocData.substring(0, tHdnRelatedDocData.length - 1) + "]";
			tHdnRelatedData = tHdnRelatedDocData;
			Grid_RelatedDocObj.reload(eval(tHdnRelatedData));
			document.getElementById("Grid_RelatedDoc").value = Grid_RelatedDocObj.toArrayString();
			document.getElementById("HdnTextbox_RelatedDoc").value = Grid_RelatedDocObj.toArrayString();
		}
	} else if (isUpperDoc == 3) {
		//被關聯文件
		var tHdnAlRelatedData = eval(document.getElementById("HdnTextbox_AlRelatedDoc").value);
		var tHdnAlRelatedDocData = "";
		if (tHdnAlRelatedData == "" || document.getElementById("HdnTextbox_AlRelatedDoc").value == "") {
			tHdnAlRelatedData = [];
		} else {
			for (var i = 0; i < tHdnAlRelatedData.length; i++) {
				tHdnAlRelatedDocData = tHdnAlRelatedDocData + "['" + tHdnAlRelatedData[i][0] + "','" + tHdnAlRelatedData[i][1] + "','" + tHdnAlRelatedData[i][2] + "','" + tHdnAlRelatedData[i][3] + "','',''],";
			}
			tHdnAlRelatedDocData = "[" + tHdnAlRelatedDocData.substring(0, tHdnAlRelatedDocData.length - 1) + "]";
			tHdnAlRelatedData = tHdnAlRelatedDocData;
			Grid_AlRelatedDocObj.reload(eval(tHdnAlRelatedData));
			document.getElementById("Grid_AlRelatedDoc").value = Grid_AlRelatedDocObj.toArrayString();
			document.getElementById("HdnTextbox_AlRelatedDoc").value = Grid_AlRelatedDocObj.toArrayString();
		}
	}
	}
	
	
}

//刪除參考文件
function Btn_DelReferDoc_onclick() {
	var tIndex = Grid_ReferDocObj.getSelectionProperty("index");
	var gridData = Grid_ReferDocObj.getData();
	var tHdnData = eval(document.getElementById("HdnTextbox_ReferDoc").value);
	var tHdnDataValue = "";
	
	if(gridData.length > 0){
		for (var i = 0; i < tHdnData.length; i++) {
			tHdnDataValue = tHdnDataValue + "['" + tHdnData[i][0] + "','" + tHdnData[i][1] + "','" + tHdnData[i][2] + "','" + tHdnData[i][3] + "'],";
		}
	}
	
	var tDeleteValue = "";
	if (gridData != "") {
		if (gridData.length > 0 && tIndex != -1) {
			tDeleteValue = "['" + gridData[tIndex][0] + "','" + gridData[tIndex][1] + "','" + gridData[tIndex][2] + "','" + gridData[tIndex][3] + "']";
			if (gridData.length == 1) {
				//刪除最後一HdnTextbox_ReferDoc
				document.getElementById("HdnTextbox_ReferDoc").value = "";
			} else {
				document.getElementById("HdnTextbox_ReferDoc").value = "[" + delRepeat(tDeleteValue, tHdnDataValue) + "]";
			}
			Grid_ReferDocObj.deleteRow();
			document.getElementById("Grid_ReferDoc").value = Grid_ReferDocObj.toArrayString();
			Grid_ReferDocObj.clearBinding();
		}
	}
	gridData = Grid_ReferDocObj.getData();
	if (gridData != "") {
		Grid_ReferDocObj.setSelectionIndex(0); //移到第一筆
	}
}

//刪除關聯文件
function Btn_DelRelatedDoc_onclick() {
	var tIndex = Grid_RelatedDocObj.getSelectionProperty("index");
	var gridData = Grid_RelatedDocObj.getData();
	var tHdnData = eval(document.getElementById("HdnTextbox_RelatedDoc").value);
	var tHdnDataValue = "";
	if(gridData.length > 0){
		for (var i = 0; i < tHdnData.length; i++) {
			tHdnDataValue = tHdnDataValue + "['" + tHdnData[i][0] + "','" + tHdnData[i][1] + "','" + tHdnData[i][2] + "','" + tHdnData[i][3] + "','',''],";
		}
	}
	
	var tDeleteValue = "";
	if (gridData != "") {
		if (gridData.length > 0 && tIndex != -1) {
			tDeleteValue = "['" + gridData[tIndex][0] + "','" + gridData[tIndex][1] + "','" + gridData[tIndex][2] + "','" + gridData[tIndex][3] + "','',''],";
			if (gridData.length == 1) {
				//刪除最後一HdnTextbox_ReferDoc
				document.getElementById("HdnTextbox_RelatedDoc").value = "";
			} else {
				document.getElementById("HdnTextbox_RelatedDoc").value = "[" + delRepeat(tDeleteValue, tHdnDataValue) + "]";
			}
			Grid_RelatedDocObj.deleteRow();
			document.getElementById("Grid_RelatedDoc").value = Grid_RelatedDocObj.toArrayString();
			Grid_RelatedDocObj.clearBinding();
		}
	}
	gridData = Grid_RelatedDocObj.getData();
	if (gridData != "") {
		Grid_RelatedDocObj.setSelectionIndex(0); //移到第一筆
	}
	
	//20150114 add by Hsieh 刪除並隱藏Grid_ViewRelatedDoc
	Grid_ViewRelatedDocObj.reload(eval("[]"));
	document.getElementById("Grid_ViewRelatedDoc").value = Grid_ViewRelatedDocObj.toArrayString();	
	var tGridId = Grid_ViewRelatedDocObj.getId();
	var tGridElement = document.getElementById(tGridId);
	tGridElement.style.display = "none";
	
	
	
}

//刪除被關聯文件
function Btn_DelAlRelatedDoc_onclick() {
	var tIndex = Grid_AlRelatedDocObj.getSelectionProperty("index");
	var gridData = Grid_AlRelatedDocObj.getData();
	var tHdnData = eval(document.getElementById("HdnTextbox_AlRelatedDoc").value);
	var tHdnDataValue = "";
	if(gridData.length > 0){
		for (var i = 0; i < tHdnData.length; i++) {
			tHdnDataValue = tHdnDataValue + "['" + tHdnData[i][0] + "','" + tHdnData[i][1] + "','" + tHdnData[i][2] + "','" + tHdnData[i][3] + "','',''],";
		}
	}
	
	var tDeleteValue = "";
	if (gridData != "") {
		if (gridData.length > 0 && tIndex != -1) {
			tDeleteValue = "['" + gridData[tIndex][0] + "','" + gridData[tIndex][1] + "','" + gridData[tIndex][2] + "','" + gridData[tIndex][3] + "','',''],";
			if (gridData.length == 1) {
				//刪除最後一HdnTextbox_ReferDoc
				document.getElementById("HdnTextbox_AlRelatedDoc").value = "";
			} else {
				document.getElementById("HdnTextbox_AlRelatedDoc").value = "[" + delRepeat(tDeleteValue, tHdnDataValue) + "]";
			}
			Grid_AlRelatedDocObj.deleteRow();
			document.getElementById("Grid_AlRelatedDoc").value = Grid_AlRelatedDocObj.toArrayString();
			Grid_AlRelatedDocObj.clearBinding();
		}
	}
	gridData = Grid_AlRelatedDocObj.getData();
	if (gridData != "") {
		Grid_AlRelatedDocObj.setSelectionIndex(0); //移到第一筆
	}
	
	//20150114 add by Hsieh 刪除並隱藏Grid_ViewAlRelatedDoc
	Grid_ViewAlRelatedDocObj.reload(eval("[]"));
	document.getElementById("Grid_ViewAlRelatedDoc").value = Grid_ViewAlRelatedDocObj.toArrayString();
	var tGridId = Grid_ViewAlRelatedDocObj.getId();
	var tGridElement = document.getElementById(tGridId);
	tGridElement.style.display = "none";
}

function Btn_DelUpperDoc_onclick() {
	//刪除上階文件
	var tIndex = Grid_UpperDocObj.getSelectionProperty("index");
	var gridData = Grid_UpperDocObj.getData();
	var tHdnData = eval(document.getElementById("HdnTextbox_UpperDoc").value);
	var tHdnDataValue = "";
	if(gridData.length > 0){
		for (var i = 0; i < tHdnData.length; i++) {
			tHdnDataValue = tHdnDataValue + "['" + tHdnData[i][0] + "','" + tHdnData[i][1] + "','" + tHdnData[i][2] + "','" + tHdnData[i][3] + "','" + tHdnData[i][4] + "','" + tHdnData[i][5] + "'],";
		}
	}
	

	var tDeleteValue = ""
	if (gridData != "") {
		if (gridData.length > 0 && tIndex != -1) {
			tDeleteValue = "['" + gridData[tIndex][0] + "','" + gridData[tIndex][1] + "','" + gridData[tIndex][2] + "','" + gridData[tIndex][3] + "','" + gridData[tIndex][4] + "','" + gridData[tIndex][5] + "']";

			if (gridData.length == 1) {
				//刪除最後一筆HdnTextbox_UpperDoc等於空白
				document.getElementById("HdnTextbox_UpperDoc").value = "";
			}
			else {
				document.getElementById("HdnTextbox_UpperDoc").value = "[" + delRepeat(tDeleteValue, tHdnDataValue) + "]";

			}
			Grid_UpperDocObj.deleteRow();
			document.getElementById("Grid_UpperDoc").value = Grid_UpperDocObj.toArrayString();
			Grid_UpperDocObj.clearBinding();
		}
	}
	gridData = Grid_UpperDocObj.getData();
	if (gridData != "") {
		Grid_UpperDocObj.setSelectionIndex(0); //移到第一筆
	}

}

//設定發行單位
function Btn_IssueUnit_onclick() { //發行單位的開窗
	if (! (checkFinish("Textbox_RoleName", "發行角色", "", "")) || !(checkFinish("Dropdown_IssueUnits", "發行單位", "", ""))) {
		return false;
	}
	chooseInputLabels_Unit("Dropdown_IssueUnits");
}
function Btn_IssueRole_onclick() {
	chooseInputLabels_Unit("Textbox_RoleName");
}
function Button_IssueUnitAdd_onclick() { //新增
	var i = 0;
	var roleOID = document.getElementById("HdnTextbox_RoleOID").value;
	var issueUnitOID = document.getElementById("HdnTextbox_IssueUnit").value;
	gIssueUnitData = Grid_IssueUnitObj.getData();
	if (gIssueUnitData.length > 0) {
		for (i = 0; i < gIssueUnitData.length; i++) {
			if (gIssueUnitData[i][0] == issueUnitOID && gIssueUnitData[i][3] == roleOID) {
				alert("此單位角色已存在！");
				return false;
			}
		}
	}

	//找出該單位角色人員代號
	var unitOID = document.getElementById("HdnTextbox_IssueUnit").value;
	var roleOID = document.getElementById("HdnTextbox_RoleOID").value;
	DWREngine.setAsync(false);
	/*20160310 mod by Hsieh 調整回產品
	if (document.getElementById("Dropdown_IssueUnits").value == "1") {
		ajax_OrgAccessor.findOrgUnitByOID(issueUnitOID, loadRoleUser1);
	} else if (document.getElementById("Dropdown_IssueUnits").value == "3") {
		ajax_OrgAccessor.findGroupByOID(issueUnitOID, loadRoleUser2);
	} else if (document.getElementById("Dropdown_IssueUnits").value == "4") {
		ajax_OrgAccessor.findUserByOID(issueUnitOID, loadRoleUser3);
	}
	*/
	ajax_ExtOrgAccessor.findActorOfRoleDef(roleOID,unitOID,false,loadRoleUser);
}

function loadRoleUser(data){
	for(var i=0;i<data.length;i++){
		document.getElementById("HdnTextbox_Person").value=document.getElementById("HdnTextbox_Person").value+data[i].id+";";			
	}
	Grid_IssueUnitObj.addRow();
	document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
}

/*20160310 mod by Hsieh 調整回產品
function loadRoleUser1(data) {
	document.getElementById("HdnTextbox_IssueUnit").value = data.OID;
	document.getElementById("Textbox_IssueUnitNo").value = data.id;
	document.getElementById("Textbox_IssueUnitName").value = data.name;
	var sql1 = "select distinct RoleDef.OID, Org.organizationName, RoleDef.roleDefinitionName " + "from Role, Organization Org, RoleDefinition RoleDef " + "where Role.definitionOID = RoleDef.OID " + "and RoleDef.organizationOID = Org.OID";
	var rs1 = tEFGPConn.query(sql1);
	if (rs1.length > 0) {
		document.getElementById("HdnTextbox_RoleOID").value = rs1[0][0];
		document.getElementById("Textbox_RoleName").value = rs1[0][1] + "_" + rs1[0][2];
	}
	var sql2 = "select U.id from Users U, OrganizationUnit O where O.managerOID = U.OID and O.OID = '" + data.OID + "'";
	var rs2 = tEFGPConn.query(sql2);
	if (rs2.length > 0) {
		document.getElementById("HdnTextbox_Person").value = rs2[0][0] + ";";
	}
	Grid_IssueUnitObj.addRow();
	var OID = document.getElementById('HdnTextbox_RoleOID').value;
	var NAME = document.getElementById('Textbox_RoleName').value;
	var Drop = document.getElementById("Dropdown_IssueUnits").value;
	Grid_IssueUnitObj.clearBinding();
	document.getElementById('HdnTextbox_RoleOID').value = OID;
	document.getElementById('Textbox_RoleName').value = NAME;
	document.getElementById("Dropdown_IssueUnits").value = Drop;
	document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
}

function loadRoleUser2(data) {
	document.getElementById("HdnTextbox_IssueUnit").value = data.OID;
	document.getElementById("Textbox_IssueUnitNo").value = data.id;
	document.getElementById("Textbox_IssueUnitName").value = data.name;
	var sql1 = "select distinct RoleDef.OID, Org.organizationName, RoleDef.roleDefinitionName " + "from Role, Organization Org, RoleDefinition RoleDef " + "where Role.definitionOID = RoleDef.OID " + "and RoleDef.organizationOID = Org.OID";
	var rs1 = tEFGPConn.query(sql1);
	if (rs1.length > 0) {
		document.getElementById("HdnTextbox_RoleOID").value = rs1[0][0];
		document.getElementById("Textbox_RoleName").value = rs1[0][1] + "_" + rs1[0][2];
	}
	var allRelatedUsers = "";
	for (var i = 0; i < data.members.length; i++) {
		allRelatedUsers = allRelatedUsers + data.members[i].id + ";";
	}
	document.getElementById("HdnTextbox_Person").value = allRelatedUsers;
	Grid_IssueUnitObj.addRow();
	var OID = document.getElementById('HdnTextbox_RoleOID').value;
	var NAME = document.getElementById('Textbox_RoleName').value;
	var Drop = document.getElementById("Dropdown_IssueUnits").value;
	Grid_IssueUnitObj.clearBinding();
	document.getElementById('HdnTextbox_RoleOID').value = OID;
	document.getElementById('Textbox_RoleName').value = NAME;
	document.getElementById("Dropdown_IssueUnits").value = Drop;
	document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
}

function loadRoleUser3(data) {
	document.getElementById("HdnTextbox_IssueUnit").value = data.OID;
	document.getElementById("Textbox_IssueUnitNo").value = data.id;
	document.getElementById("Textbox_IssueUnitName").value = data.name;
	var sql1 = "select distinct RoleDef.OID, Org.organizationName, RoleDef.roleDefinitionName " + "from Role, Organization Org, RoleDefinition RoleDef " + "where Role.definitionOID = RoleDef.OID " + "and RoleDef.organizationOID = Org.OID";
	var rs1 = tEFGPConn.query(sql1);
	if (rs1.length > 0) {
		document.getElementById("HdnTextbox_RoleOID").value = rs1[0][0];
		document.getElementById("Textbox_RoleName").value = rs1[0][1] + "_" + rs1[0][2];
	}
	document.getElementById("HdnTextbox_Person").value = document.getElementById("Textbox_IssueUnitNo").value + ";";
	Grid_IssueUnitObj.addRow();
	var OID = document.getElementById('HdnTextbox_RoleOID').value;
	var NAME = document.getElementById('Textbox_RoleName').value;
	var Drop = document.getElementById("Dropdown_IssueUnits").value;
	Grid_IssueUnitObj.clearBinding();
	document.getElementById('HdnTextbox_RoleOID').value = OID;
	document.getElementById('Textbox_RoleName').value = NAME;
	document.getElementById("Dropdown_IssueUnits").value = Drop;
	document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
}
*/

function Button_IssueUnitDel_onclick() { //刪除
	Grid_IssueUnitObj.deleteRow();
	document.getElementById("Grid_IssueUnit").value = Grid_IssueUnitObj.toArrayString();
	Grid_IssueUnitObj.clearBinding();
}
//條文開窗
function Button_ISOClauseAdd_onclick() {

	//若文件型態沒有選擇 show提示訊息
	if (document.getElementById("HdnTextbox_ISOType").value != "") {
		var tDocLevelsArry = eval(document.getElementById("HdnTextbox_ISOType").value);
		var tDocTypeOID = "";
		for (var i = 0; i < tDocLevelsArry.length; i++) {
			if (tDocTypeOID.indexOf(tDocLevelsArry[i][2]) < 0) {
				tDocTypeOID = tDocTypeOID + "'" + tDocLevelsArry[i][2] + "',";
			}

		}
		tDocTypeOID = tDocTypeOID.substring(0, tDocTypeOID.length - 1)

	} else {
		alert('請先選擇ISO型態');
		return false;
	}
	//將Link由../../../GP/WMS/ 改為 /NaNaWeb/GP/WMS/ SINCE : NANA5.5.2 MODI BY 4182 IN 20121220
	openDialog("/NaNaWeb/GP/WMS/ManageDocument/CreateDocument?hdnMethod=chooseDocClause&returnField=HdnTextbox_ISOClause&hdnClauseParam1=" + tDocTypeOID, "600", "300", "titlebar,scrollbars,status,resizable");

}
function updateSelectedClauses() {
	var tHdnData = document.getElementById("HdnTextbox_ISOClause").value;

	var tHdnDataValue = "";
	if (tHdnData == "") {
		tHdnDataValue = [];
	}
	else {
		tHdnData = eval(document.getElementById("HdnTextbox_ISOClause").value);
		for (var i = 0; i < tHdnData.length; i++) {
			tHdnDataValue = tHdnDataValue + "['" + tHdnData[i][0] + "','" + tHdnData[i][1] + "-" + tHdnData[i][2] + "','" + tHdnData[i][3] + "'],";
		}
	}
	tHdnDataValue = "[" + tHdnDataValue.substring(0, tHdnDataValue.length - 1) + "]";

	Grid_ISOClauseObj.reload(eval(tHdnDataValue));
	document.getElementById("Grid_ISOClause").value = Grid_ISOClauseObj.toArrayString();

}

//刪除條文
function Button_ISOClauseDel_onclick() {
	var tIndex = Grid_ISOClauseObj.getSelectionProperty("index");
	var gridData = Grid_ISOClauseObj.getData();
	var tHdnData = eval(document.getElementById("HdnTextbox_ISOClause").value);
	var tHdnDataValue = "";
	for (var i = 0; i < tHdnData.length; i++) {
		tHdnDataValue = tHdnDataValue + "['" + tHdnData[i][0] + "','" + tHdnData[i][1] + "','" + tHdnData[i][2] + "','" + tHdnData[i][3] + "'],";
	}

	var tDeleteValue = ""
	if (gridData != "") {
		if (gridData.length > 0 && tIndex != -1) {
			var tGridDataSplit = gridData[tIndex][1].split("-");
			tDeleteValue = "['" + gridData[tIndex][0] + "','" + tGridDataSplit[0] + "','" + tGridDataSplit[1] + "','" + gridData[tIndex][2] + "']";
			if (gridData.length == 1) {
				//刪除最後一筆HdnTextbox_ISOClause等於空白
				document.getElementById("HdnTextbox_ISOClause").value = "";
			}
			else {
				document.getElementById("HdnTextbox_ISOClause").value = "[" + delRepeat(tDeleteValue, tHdnDataValue) + "]";

			}
			Grid_ISOClauseObj.deleteRow();
			document.getElementById("Grid_ISOClause").value = Grid_ISOClauseObj.toArrayString();
			Grid_ISOClauseObj.clearBinding();
		}
	}
	gridData = Grid_ISOClauseObj.getData();
	if (gridData != "") {
		Grid_ISOClauseObj.setSelectionIndex(0); //移到第一筆
	}
}
//HdnTextbox_ISOClause刪除 已刪除的值
function delRepeat(values, originData) {
	values = values + ",";
	var cutRepeat = originData.split(values);
	var returnData = ""
	for (var i = 0; i < cutRepeat.length; i++) {
		returnData = returnData + cutRepeat[i];
	}
	return returnData.substring(0, returnData.length - 1);
}
//設定會簽單位
function Button_RelatedUnit_onclick() { //會簽單位的開窗
	if (! (checkFinish("Dropdown_RelatedUnits", "會簽單位", "", ""))) {
		return false;
	}
	chooseInputLabels_Unit("Dropdown_RelatedUnits");
}
function Button_AddUnit_onclick() { //新增
	var relatedUnit = document.getElementById("Textbox_RelatedUnitNo").value;
	gRelateUnitData = Grid_RelateUnitObj.getData();
	if (ifGridDup(gRelateUnitData, relatedUnit, "此單位已存在！", 0)) {
		var tUnitType = document.getElementById("Dropdown_RelatedUnits").value;
		var tUnitOID = document.getElementById("HdnTextbox_RelatedUnit").value;
		DWREngine.setAsync(false);
		if (tUnitType == "1" || tUnitType == "2") {
			
			ajax_OrgAccessor.findOrgUnitByOID(tUnitOID, loadUnitUser1);
		} else if (tUnitType == "3") {
			ajax_OrgAccessor.findGroupByOID(tUnitOID, loadUnitUser2);
		} else if (tUnitType == "4") {
			ajax_OrgAccessor.findUserByOID(tUnitOID, loadUnitUser3);
		}
	}
}

function Button_DelUnit_onclick() { //刪除
	Grid_RelateUnit_EFGPObj.deleteRow();
	document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString();
	Grid_RelateUnit_EFGPObj.clearBinding();
	document.getElementById("Dropdown_RelatedUnits").value = 1;
	setRelatedUnitsGrid();	//20160321 Add By Alice
}

function loadUnitUser1(data) {
	document.getElementById("HdnTextbox_RelatedUnit").value = data.OID;
	document.getElementById("Textbox_RelatedUnitNo").value = data.id;
	document.getElementById("Textbox_RelatedUnitName").value = data.name;
	var sql2 = "select U.id from Users U, OrganizationUnit O where O.managerOID = U.OID and O.OID = '" + data.OID + "'";
	var rs2 = tEFGPConn.query(sql2);
	if (rs2.length > 0) {
		document.getElementById("HdnTextbox_UnitUsers").value = rs2[0][0] + ";";
	}
	Grid_RelateUnit_EFGPObj.addRow();
	var Drop = document.getElementById("Dropdown_RelatedUnits").value;
	Grid_RelateUnit_EFGPObj.clearBinding();
	document.getElementById("Dropdown_RelatedUnits").value = Drop;
	document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString();
	setRelatedUnitsGrid();	//20160321 Add By Alice
	
}

function loadUnitUser2(data) {
	document.getElementById("HdnTextbox_RelatedUnit").value = data.OID;
	document.getElementById("Textbox_RelatedUnitNo").value = data.id;
	document.getElementById("Textbox_RelatedUnitName").value = data.name;
	var allRelatedUsers = "";
	for (var i = 0; i < data.members.length; i++) {
		allRelatedUsers = allRelatedUsers + data.members[i].id + ";";
	}
	document.getElementById("HdnTextbox_UnitUsers").value = allRelatedUsers;
	Grid_RelateUnit_EFGPObj.addRow();
	var Drop = document.getElementById("Dropdown_RelatedUnits").value;
	Grid_RelateUnit_EFGPObj.clearBinding();
	document.getElementById("Dropdown_RelatedUnits").value = Drop;
	document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString();
	setRelatedUnitsGrid();	//20160321 Add By Alice
	
}

function loadUnitUser3(data) {
	document.getElementById("HdnTextbox_RelatedUnit").value = data.OID;
	document.getElementById("Textbox_RelatedUnitNo").value = data.id;
	document.getElementById("Textbox_RelatedUnitName").value = data.name;
	document.getElementById("HdnTextbox_UnitUsers").value = data.id + ";";
	Grid_RelateUnit_EFGPObj.addRow();
	var Drop = document.getElementById("Dropdown_RelatedUnits").value;
	Grid_RelateUnit_EFGPObj.clearBinding();
	document.getElementById("Dropdown_RelatedUnits").value = Drop;
	document.getElementById("Grid_RelateUnit_EFGP").value = Grid_RelateUnit_EFGPObj.toArrayString();
	
}

//設定加签品管
function btnAddQC_onclick() {
	chooseInputLabel_Unit("Dropdown_QCUnits");
}

function Button_AddUnit_onclick1() { //新增
	// if(!(checkFinish("Textbox_RelatedUnitNo","會簽單位","",""))){
	// 	return false;
	// }
	//if (document.getElementById('Textbox_RelatedUnitNo').value == "") {
		//alert("請先選擇會簽單位表格中要更新的一條記錄！")
	//}
	//var relatedUnit = document.getElementById("txtAddQC").value;
	//gRelateUnitData = Grid_RelateUnitObj.getData();
	//if (ifGridDup(gRelateUnitData, relatedUnit, "此單位已存在！", 0)) {
	var tUnitType = document.getElementById("Dropdown_QCUnits").value;
	var tUnitOID = document.getElementById("HdnTextbox_QCMan").value;
	DWREngine.setAsync(false);
	if (tUnitType == "1" || tUnitType == "2") {
		ajax_OrgAccessor.findOrgUnitByOID(tUnitOID, loadUnitUserQC1);
	} else if (tUnitType == "3") {
		ajax_OrgAccessor.findGroupByOID(tUnitOID, loadUnitUserQC2);
	} else if (tUnitType == "4") {
		ajax_OrgAccessor.findUserByOID(tUnitOID, loadUnitUserQC3);
	}
	DWREngine.setAsync(true);
	//}
}

function loadUnitUserQC1(data) {
	/*
	var allRelatedUsers = "";
	for (var i = 0; i < data.members.length; i++) {
		allRelatedUsers = allRelatedUsers + data.members[i].id + ";";
	}
	document.getElementById("HdnTextbox_RelatedUnit").value = document.getElementById("HdnTextbox_QCMan").value;
	document.getElementById("Textbox_RelatedUnitNo").value = document.getElementById("txtAddQC").value;
	document.getElementById("Textbox_RelatedUnitName").value = document.getElementById("txtAddQCName").value;
	var sql2 = "select U.id from Users U, OrganizationUnit O where O.managerOID = U.OID and O.OID = '" + data.OID + "'";
	var rs2 = tEFGPConn.query(sql2);
	if (rs2.length > 0) {
		document.getElementById("HdnTextbox_UnitUsers").value = rs2[0][0] + ";";
	}
	Grid_RelateUnitObj.addRow();
	var Drop = document.getElementById("Dropdown_RelatedUnits").value;
	Grid_IssueUnitObj.clearBinding();
	document.getElementById("Dropdown_RelatedUnits").value = Drop;
	document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();
	setRelatedUnitsGrid();	//20160321 Add By Alice
	*/
	var sql2 = "select U.id from Users U, OrganizationUnit O where O.managerOID = U.OID and O.OID = '" + data.OID + "'";
	var rs2 = tEFGPConn.query(sql2);
	if (rs2.length > 0) {
		document.getElementById("HdnTextbox_QCMan").value = rs2[0][0] + ";";
	}
}

function loadUnitUserQC2(data) {
	/*
	document.getElementById("HdnTextbox_RelatedUnit").value = document.getElementById("HdnTextbox_QCMan").value;
	document.getElementById("Textbox_RelatedUnitNo").value = document.getElementById("txtAddQC").value;
	document.getElementById("Textbox_RelatedUnitName").value = document.getElementById("txtAddQCName").value;	
	var allRelatedUsers = "";
	for (var i = 0; i < data.members.length; i++) {
		allRelatedUsers = allRelatedUsers + data.members[i].id + ";";
	}

	document.getElementById("HdnTextbox_UnitUsers").value = allRelatedUsers + ";";
	
	Grid_RelateUnitObj.addRow();
	var Drop = document.getElementById("Dropdown_RelatedUnits").value;
	Grid_IssueUnitObj.clearBinding();
	document.getElementById("Dropdown_RelatedUnits").value = Drop;
	document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();
	setRelatedUnitsGrid();	//20160321 Add By Alice
	*/

	var allRelatedUsers = "";
	for (var i = 0; i < data.members.length; i++) {
		allRelatedUsers = allRelatedUsers + data.members[i].id + ";";
	}

	document.getElementById("HdnTextbox_QCMan").value = allRelatedUsers ;
}

function loadUnitUserQC3(data) {
	/*
	document.getElementById("HdnTextbox_RelatedUnit").value = document.getElementById("HdnTextbox_QCMan").value;
	document.getElementById("Textbox_RelatedUnitNo").value = document.getElementById("txtAddQC").value;
	document.getElementById("Textbox_RelatedUnitName").value = document.getElementById("txtAddQCName").value;
	
	
	Grid_RelateUnitObj.addRow();
	var Drop = document.getElementById("Dropdown_RelatedUnits").value;
	Grid_IssueUnitObj.clearBinding();
	document.getElementById("Dropdown_RelatedUnits").value = Drop;
	document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();
	//setRelatedUnitsGrid();	//20160321 Add By Alice	
	
	*/
	document.getElementById("HdnTextbox_QCMan").value = document.getElementById("txtAddQC").value + ";";
}

//20160321 Add By Alice
function setRelatedUnitsGrid(){
	var tEFGPGridData=document.getElementById("Grid_RelateUnit_EFGP").value;
	var tNewArray=new Array();
	if(tEFGPGridData.length>4){
		var k=0;
		var tEFGPGridArray=eval(tEFGPGridData);
		for(var i=0;i<tEFGPGridArray.length;i++){
			if(tEFGPGridArray[i][2]!="4"){
				tNewArray[k]=tEFGPGridArray[i];
				k++;
			}
		}
	}
	Grid_RelateUnitObj.reload(tNewArray);
	document.getElementById("Grid_RelateUnit").value = Grid_RelateUnitObj.toArrayString();
}


//設定權限屬性
function Dropdown_PowerFrom_onchange() {
	var powerFromInd = document.getElementById("Dropdown_PowerFrom").selectedIndex;
	document.getElementById("HdnTextbox_PowerFrom").value = document.getElementById("Dropdown_PowerFrom")[powerFromInd].text;
}
function Button_PowerAdd_onclick() { //新增
	if (! (checkFinish("Dropdown_PowerFrom", "權限群組", "", "")) || !(checkFinish("Dropdown_PowerFrom", "權限群組", "0", ""))) {
		return false;
	}
	var powerFrom = document.getElementById("Dropdown_PowerFrom").value;
	gPowerData = Grid_PowerObj.getData();
	if (ifGridDup(gPowerData, powerFrom, "此群組已存在！", 1)) {
		Grid_PowerObj.addRow();
		document.getElementById("Grid_Power").value = Grid_PowerObj.toArrayString();
		Grid_PowerObj.clearBinding();
	}
}
function Button_PowerDel_onclick() { //刪除
	Grid_PowerObj.deleteRow();
	document.getElementById("Grid_Power").value = Grid_PowerObj.toArrayString();
	Grid_PowerObj.clearBinding();
}

function setGridStyle() {
	//ISO型態/文件階層 Grid_ISOType，隱藏OID欄位
	//Grid_ISOTypeObj.setColumnValues([1,2]);
	//20160319 Edit by Bryan 顯示 ISO型態/文件階層 欄位，其它隱藏
	if(typeof(Grid_ISOTypeObj) != "undefined"){		
		Grid_ISOTypeObj.setColumnIndices([1]);

	//document.write("<style>#" + Grid_ISOTypeObj.getId() + " .aw-column-0{display: none!important;}</style>");
	document.write("<style>#" + Grid_ISOTypeObj.getId() + " .aw-column-1{width:500px;}</style>");
	//document.write("<style>#" + Grid_ISOTypeObj.getId() + " .aw-column-2{display: none!important;}</style>");
	}
	
	//ISO條文 Grid_ISOClause，隱藏OID及型態名稱欄位
	if(typeof(Grid_ISOClauseObj) != "undefined"){	
	document.write("<style>#" + Grid_ISOClauseObj.getId() + " .aw-column-0{display: none!important;}</style>");
	document.write("<style>#" + Grid_ISOClauseObj.getId() + " .aw-column-2{display: none!important;}</style>");
	document.write("<style>#" + Grid_ISOClauseObj.getId() + " .aw-column-1{width:500px;}</style>");
	}
	
	//文件類別Grid，隱藏OID欄位
	//20160319 Edit by Bryan 顯示 類別與類別名稱 欄位，其它隱藏
	if(typeof(Grid_DocCategoryObj) != "undefined"){	
		Grid_DocCategoryObj.setColumnIndices([1,2]);

	//Grid_DocCategoryObj.setColumnValues([1]);
	//document.write("<style>#" + Grid_DocCategoryObj.getId() + " .aw-column-0{display: none!important;}</style>");
	document.write("<style>#" + Grid_DocCategoryObj.getId() + " .aw-column-1{width:400px;}</style>");
	//document.write("<style>#" + Grid_DocCategoryObj.getId() + " .aw-column-2{display: none!important;}</style>");
	document.write("<style>#" + Grid_DocCategoryObj.getId() + " .aw-column-2{width:150px;}</style>");
	}
	
	if(typeof(Grid_DocServerObj) != "undefined"){	
	//文件伺服器Grid_DocServer
	//Grid_DocServerObj.setColumnValues([1]);
	document.write("<style>#" + Grid_DocServerObj.getId() + " .aw-column-0{display: none!important;}</style>");
	document.write("<style>#" + Grid_DocServerObj.getId() + " .aw-column-1{width:250px;}</style>");
	document.write("<style>#" + Grid_DocServerObj.getId() + " .aw-column-2{width:250px;}</style>");
	}

	//參考文件Grid_ReferDoc，隱藏OID欄位
	//Grid_ReferDocObj.setColumnValues([1,2,3]);
	//20160319 Edit by Bryan 顯示 文件編號、文件名稱及版號 欄位，其它隱藏
	if(typeof(Grid_ReferDocObj) != "undefined"){		
		Grid_ReferDocObj.setColumnIndices([1,2,3]);	

	//document.write("<style>#" + Grid_ReferDocObj.getId() + " .aw-column-0{display: none!important;}</style>");
	document.write("<style>#" + Grid_ReferDocObj.getId() + " .aw-column-1{width:200px;}</style>");
	document.write("<style>#" + Grid_ReferDocObj.getId() + " .aw-column-2{width:200px;}</style>");
	document.write("<style>#" + Grid_ReferDocObj.getId() + " .aw-column-3{width:100px;}</style>");
	}
	
	//上階文件Grid_UpperDoc,隱藏OID欄位
	//20160319 Edit by Bryan 
	if(typeof(Grid_UpperDocObj) != "undefined"){		
		Grid_UpperDocObj.setColumnIndices([1,2,3]);

	//document.write("<style>#" + Grid_UpperDocObj.getId() + " .aw-column-0{display: none!important;}</style>");
	document.write("<style>#" + Grid_UpperDocObj.getId() + " .aw-column-1{width:200px;}</style>");
	document.write("<style>#" + Grid_UpperDocObj.getId() + " .aw-column-2{width:200px;}</style>");
	document.write("<style>#" + Grid_UpperDocObj.getId() + " .aw-column-3{width:100px;}</style>");
	//document.write("<style>#" + Grid_UpperDocObj.getId() + " .aw-column-4{display: none!important;}</style>");
	//document.write("<style>#" + Grid_UpperDocObj.getId() + " .aw-column-5{display: none!important;}</style>");
	}
	
	//發行單位Grid_IssueUnit
	//Grid_IssueUnitObj.setColumnValues([1,2,4]);
	//20160319 Edit by Bryan 
	if(typeof(Grid_IssueUnitObj) != "undefined"){		
		Grid_IssueUnitObj.setColumnIndices([1,2,5,6]);

	//document.write("<style>#" + Grid_IssueUnitObj.getId() + " .aw-column-0{display: none!important;}</style>");
	document.write("<style>#" + Grid_IssueUnitObj.getId() + " .aw-column-1{width:100px;}</style>");
	document.write("<style>#" + Grid_IssueUnitObj.getId() + " .aw-column-2{width:220px;}</style>");
	//document.write("<style>#" + Grid_IssueUnitObj.getId() + " .aw-column-3{display: none!important;}</style>");
	//document.write("<style>#" + Grid_IssueUnitObj.getId() + " .aw-column-4{display: none!important;}</style>");
	document.write("<style>#" + Grid_IssueUnitObj.getId() + " .aw-column-5{width:200px;}</style>");
	document.write("<style>#" + Grid_IssueUnitObj.getId() + " .aw-column-6{width:300px;}</style>");
	}

	//會簽單位Grid_RelateUnit
	//Grid_RelateUnitObj.setColumnValues([0,1]);
	//20160319 Edit by Bryan 
	if(typeof(Grid_RelateUnit_EFGPObj) != "undefined"){	
		Grid_RelateUnit_EFGPObj.setColumnIndices([0,1,4]);	

	document.write("<style>#" + Grid_RelateUnit_EFGPObj.getId() + " .aw-column-0{width:150px;}</style>");
	document.write("<style>#" + Grid_RelateUnit_EFGPObj.getId() + " .aw-column-1{width:250px;}</style>");
	//document.write("<style>#" + Grid_RelateUnit_EFGPObj.getId() + " .aw-column-2{display: none!important;}</style>");
	//document.write("<style>#" + Grid_RelateUnit_EFGPObj.getId() + " .aw-column-3{display: none!important;}</style>");
	//document.write("<style>#" + Grid_RelateUnit_EFGPObj.getId() + " .aw-column-4{display: none!important;}</style>");
	document.write("<style>#" + Grid_RelateUnit_EFGPObj.getId() + " .aw-column-4{width:200px;}</style>");	
	}

	//權限屬性Grid_Power，隱藏OID欄位
	//Grid_PowerObj.setColumnValues([0]);
	//20160319 Edit by Bryan 
	if(typeof(Grid_PowerObj) != "undefined"){  	
		Grid_PowerObj.setColumnIndices([0]);	

	document.write("<style>#" + Grid_PowerObj.getId() + " .aw-column-0{width:300px;}</style>");
	//document.write("<style>#" + Grid_PowerObj.getId() + " .aw-column-1{display: none!important;}</style>");
	}

	// 20160316 改成用另一種寫法
	//20160319 Edit by Bryan Grid顯示及寬度設定
	//關聯文件Grid
	if(typeof(Grid_RelatedDocObj) != "undefined"){  
		Grid_RelatedDocObj.setColumnIndices([1,2,3,4,5]);  

	document.write("<style>#" + Grid_RelatedDocObj.getId() + " .aw-column-1{width:120px;}</style>");
	document.write("<style>#" + Grid_RelatedDocObj.getId() + " .aw-column-2{width:200px;}</style>");
	document.write("<style>#" + Grid_RelatedDocObj.getId() + " .aw-column-3{width:70px;}</style>");
	document.write("<style>#" + Grid_RelatedDocObj.getId() + " .aw-column-4{width:70px;}</style>");
	document.write("<style>#" + Grid_RelatedDocObj.getId() + " .aw-column-5{width:150px;}</style>");	
	}

	//關聯文件附件Grid	
	if(typeof(Grid_ViewRelatedDocObj) != "undefined"){  
		Grid_ViewRelatedDocObj.setColumnIndices([0,1,2,3]);  

	document.write("<style>#" + Grid_ViewRelatedDocObj.getId() + " .aw-column-0{width:50px;}</style>");
	document.write("<style>#" + Grid_ViewRelatedDocObj.getId() + " .aw-column-1{width:90px;}</style>");
	document.write("<style>#" + Grid_ViewRelatedDocObj.getId() + " .aw-column-2{width:300px;}</style>");
	document.write("<style>#" + Grid_ViewRelatedDocObj.getId() + " .aw-column-3{width:150px;}</style>");
	}

	//被關聯文件Grid
	if(typeof(Grid_AlRelatedDocObj) != "undefined"){  
		Grid_AlRelatedDocObj.setColumnIndices([1,2,3,4,5]);  

	document.write("<style>#" + Grid_AlRelatedDocObj.getId() + " .aw-column-1{width:120px;}</style>");
	document.write("<style>#" + Grid_AlRelatedDocObj.getId() + " .aw-column-2{width:200px;}</style>");
	document.write("<style>#" + Grid_AlRelatedDocObj.getId() + " .aw-column-3{width:70px;}</style>");
	document.write("<style>#" + Grid_AlRelatedDocObj.getId() + " .aw-column-4{width:70px;}</style>");
	document.write("<style>#" + Grid_AlRelatedDocObj.getId() + " .aw-column-5{width:150px;}</style>");
	}	
	
	//被關聯文件附件Grid		
	if(typeof(Grid_ViewAlRelatedDocObj) != "undefined"){  
		Grid_ViewAlRelatedDocObj.setColumnIndices([0,1,2,3]);  

	document.write("<style>#" + Grid_ViewAlRelatedDocObj.getId() + " .aw-column-0{width:50px;}</style>");
	document.write("<style>#" + Grid_ViewAlRelatedDocObj.getId() + " .aw-column-1{width:90px;}</style>");
	document.write("<style>#" + Grid_ViewAlRelatedDocObj.getId() + " .aw-column-2{width:300px;}</style>");
	document.write("<style>#" + Grid_ViewAlRelatedDocObj.getId() + " .aw-column-3{width:150px;}</style>");
	}

	//ISO附件Grid		
	if(typeof(Grid_ISOFilesObj) != "undefined"){  
		 Grid_ISOFilesObj.setColumnIndices([0,1,2,3,4,5,6,7]);  

	document.write("<style>#" + Grid_ISOFilesObj.getId() + " .aw-column-0{width:50px;}</style>");
	document.write("<style>#" + Grid_ISOFilesObj.getId() + " .aw-column-1{width:90px;}</style>");
	document.write("<style>#" + Grid_ISOFilesObj.getId() + " .aw-column-2{width:300px;}</style>");
	document.write("<style>#" + Grid_ISOFilesObj.getId() + " .aw-column-3{width:150px;}</style>");
	document.write("<style>#" + Grid_ISOFilesObj.getId() + " .aw-column-4{width:100px;}</style>");
	document.write("<style>#" + Grid_ISOFilesObj.getId() + " .aw-column-5{width:130px;}</style>");
	document.write("<style>#" + Grid_ISOFilesObj.getId() + " .aw-column-6{width:100px;}</style>");	
	document.write("<style>#" + Grid_ISOFilesObj.getId() + " .aw-column-7{width:100px;}</style>");
	}
	
	/*
	document.write("<style>#" + Grid_ViewRelatedDocObj.getId() + " .aw-column-4{width:1px;}</style>");
	document.write("<style>#" + Grid_ViewRelatedDocObj.getId() + " .aw-column-5{width:1px;}</style>");
	document.write("<style>#" + Grid_ViewRelatedDocObj.getId() + " .aw-column-6{width:1px;}</style>");
	document.write("<style>#" + Grid_ViewAlRelatedDocObj.getId() + " .aw-column-4{width:1px;}</style>");
	document.write("<style>#" + Grid_ViewAlRelatedDocObj.getId() + " .aw-column-5{width:1px;}</style>");
	document.write("<style>#" + Grid_ViewAlRelatedDocObj.getId() + " .aw-column-6{width:1px;}</style>");
	
	document.write("<style>#" + Grid_ISOFilesObj.getId() + " .aw-column-8{width:1px;}</style>");
	document.write("<style>#" + Grid_ISOFilesObj.getId() + " .aw-column-9{width:1px;}</style>");
	*/
}

function checkFinish(textId, textname, content, focusId) {
	var textVar = document.getElementById(textId).value;
	if (textVar == content) {
		alert("請填寫" + textname);
		// if(focusId==""){
		// 	document.getElementById(textId).focus();
		// }else{
		// 	document.getElementById(focusId).focus();
		// }
		return false;
	}
	return true;
}

//判斷Grid是否有重複值
function ifGridDup(tGridData, tdata, message, m) {
	var i = 0;
	if (tGridData.length > 0) {
		for (i = 0; i < tGridData.length; i++) {
			if (tGridData[i][m] == tdata) {
				alert(message);
				return false;
			}
		}
	}
	return true;
}

function queryList(resultList, sel) {
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
	if (sel.length > 0) {
		var i;
		for (i = sel.length - 1; i >= 0; i--) {
			sel.remove(i);
		}
	}
}
function appendOptionLast(sel, txt, val) {
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

//"文件版號"==>選擇系統自動產生  or 自行定義
function rdoIsVersionAutoGen_onclick() {
	//系統自動產生
	if (document.getElementById("rdoIsVersionAutoGen_0").checked) {
		document.getElementById("Textbox_CustomVersion").value = "";
		document.getElementById("hdn_enableDispatch").value = true;
		//	document.getElementById("Button_chkVersion").disabled=true;
		//自行定義
		//要經過「檢查版號」正確、未重複才可以派送
	} else if (document.getElementById("rdoIsVersionAutoGen_1").checked) {
		//	document.getElementById("hdn_enableDispatch").value=false;
		//	document.getElementById("Button_chkVersion").disabled=false;
		//	document.getElementById("Textbox_CustomVersion").disabled=false;
	}
}

//判斷版號是否已檢查正確，才可派送
function checkEnableDispatch() {
	//記錄ajax回傳檢查版號是否正確
	var EnableDispatch = document.getElementById("hdn_enableDispatch").value;

	if (EnableDispatch == "false") {
		alert("尚未檢查版號或版號已重複");
		return false;
	} else {
		return true;
	}
}

//檢查使用者自訂版號是否正確
function Button_chkVersion_onclick() {
	if (!document.getElementById("rdoIsVersionAutoGen_1").checked || trim(document.getElementById("Textbox_CustomVersion").value) == "") {
		alert("尚未選擇及輸入自訂版號");
		return false;
	}

	var tDocNo = trim(document.getElementById("Textbox_DocNo").value);
	var tCustomerVersion = trim(document.getElementById("Textbox_CustomVersion").value);
	if (tDocNo != "" && tCustomerVersion != "") {
		ajax_IsoModuleAccessor.isDocVersionDuplicate(tDocNo, tCustomerVersion, loadChkVersionResult);
	}
}

function loadChkVersionResult(data) {
	//true 表示版號已重複
	if (data) {
		alert("版號已重複");
	} else {
		document.getElementById("hdn_enableDispatch").value = true;
	}
}

function Textbox_CustomVersion_onchange() {
	document.getElementById("hdn_enableDispatch").value = false;

	var tDocNo = trim(document.getElementById("Textbox_DocNo").value);
	var tCustomerVersion = trim(document.getElementById("Textbox_CustomVersion").value);
	if (tDocNo != "" && tCustomerVersion != "") {
		ajax_IsoModuleAccessor.isDocVersionDuplicate(tDocNo, tCustomerVersion, loadChkVersionResult);
	}

} //失效提前通知日整數
/* function Textbox_InvNodDays_onBlur(){
numberCheck("Textbox_InvNodDays",false);
} */

/**
 * 欄位檢查 - 檢查是否輸入的是數字
 * @param {Object} pId 元件ID
 * @param {Object} pStatus 是否含小數 true : 含  false : 不含
 */
function numberCheck(pId, pStatus) {
	var tValue = document.getElementById(pId).value;
	var tFoamt = "";
	if (pStatus) {
		tFoamt = /^\d+(\.\d+)?$/.test(tValue);
	}
	else {
		tFoamt = /^[0-9]*$/g.test(tValue);
	}
	if (tValue != "") {
		if (tFoamt) { //輸入格式符合
			return true;
		}
		else { //輸入格式不符
			alert("輸入格式不符 !");
			document.getElementById(pId).value = "";
			return false;
		}
	}
}

// 增加Grid上下移動功能  SINCE : NANA5.5.2 MODI BY 4182 IN 20121220
function btnISOClause_onClick() {
	FormdisplayGridCtrl(Grid_ISOClauseObj, document.getElementById("btnISOClause"));
}

function btnDocServer_onClick() {
	FormdisplayGridCtrl(Grid_DocServerObj, document.getElementById("btnDocServer"));
}

function btnReferDoc_onClick() {
	FormdisplayGridCtrl(Grid_ReferDocObj, document.getElementById("btnReferDoc"));
}

function btnUpperDoc_onClick() {
	FormdisplayGridCtrl(Grid_UpperDocObj, document.getElementById("btnUpperDoc"));
}

function btnIssueUnit_onClick() {
	FormdisplayGridCtrl(Grid_IssueUnitbj, document.getElementById("btnIssueUnit"));
}

function btnRelateUnit_onClick() {
	FormdisplayGridCtrl(Grid_RelateUnit_EFGPObj, document.getElementById("btnRelateUnit"));
}

function btnPower_onClick() {
	FormdisplayGridCtrl(Grid_PowerObj, document.getElementById("btnPower"));
}

//新增審閱單位相關項目 SINCE : NANA5.5.2 MODI BY 4182 IN 20130218  START
function ddlVettingUnitType_onchange() {
	document.getElementById("txtVettingUnitID").value = "";
	document.getElementById("txtVettingUnitName").value = "";
	document.getElementById("hdnVettingUnitOID").value = "";
}

function btnVettingUnit_onclick() {
	chooseInputLabel_Unit("ddlVettingUnitType");
}

//20160322 Add by Bryan 檢查表單欄位是否必填
function formCheck(){
	var msg = "";
	
	//關卡ModISODocManager必須填核准主管欄位
	if(activityId == "ModISODocManager" && txaFinalManager_txt.value==""){
		msg+="請填寫核准主管\n";
	}
	
	if(msg!=""){
		alert(msg);
		return false;
	}else{
		return true;
	}
}


//$-----Auto generated script block, Please do not edit or modify script below this line.-----$//