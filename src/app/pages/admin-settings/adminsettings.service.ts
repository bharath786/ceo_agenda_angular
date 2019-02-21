import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TreeNode } from 'primeng/api';
import { url } from 'src/app/shared/_constants.data';


export interface Element {
  Id: number;
  Username: string;
  EmailID: string;
  PhoneNumber: string;
  Permissions: string;
  Status: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class AdminsettingsService {

  public headers: any;
  sessiontoken: string;
  sessionuser: string;

  //For Manage Users API's
  userUpsertAPI = url + "upsert";
  usersListAPI = url + "get-users";
  deleteRecordAPI = url + "user-delete";
  userStatusAPI = url + "user-status";
  getEntiesListAPI = url + "get-divisions";
  resendMailAPI = url+"send-verification-mail";
  insertUserEntitiesAPI = url+"Insert-user-entity-assignment";
  getUserRelatedEntitiesAPI = url+"Get-user-assigned-entities";
  getUserEntitiesListAPI = url + "Get-user-assigned-entities-names";
  getEntityDataAPI = url+ "get-entity-data"

  //For Structure API's
  getStructureAPI = url + "get-structure";
  updateOrganizationAPI = url + "updateorganization";
  upsertDivisionAPI = url + "divisionupsert";
  getCountriesAPI = url + "countrieslist";
  getStatesAPI = url + "stateslist?id=";
  getCitiesAPI = url + "citylist?id=";
  locationUpsertAPI = url + "locationupsert";
  entityUpsertAPI = url + "entityupsert";
  deleteDivisionAPI = url + "delete-division";
  deleteLocationAPI = url + "delete-location";
  deleteEntityAPI = url + "delete-entity";
  getDimensionsEntityBasedAPI = url + "get-dimension-entity";

  //For Setup API's
  getSetupAPI = url + "get-setup";
  updateAnalyticsAPI = url + "update-analytics";
  dimensionFrequencyAPI = url + "get-dimensionsDD";
  upsertDimensionAPI = url + "upsert-dimension";
  deleteDimensionAPI = url + "delete-dimension";
  upsertKraAPI = url + "upsert-kra";
  deleteKraAPI = url + "delete-kra";
  upsertKpiAPI = url + "upsert-kpi";
  deleteKpiAPI = url + "delete-kpi";
  kpiDatattypesAPI = url + "get-kpi-lookups";

  //For Target Screen
  getDivisionAPI = url + "get-lookup-division";
  getLocationsAPI = url + "get-lookup-location";
  getEntitiesAPI = url + "get-lookup-entity";
  getTargetTemplateAPI = url + "get-target-template";
  upsertTargetAPI = url + "add-edit-target-value";
  getTargetValueAPI = url+ "get-target-value";



  constructor(private http: HttpClient) {
  }

  //For Targets Methods

  //For all divisions
  getDivisions() {
    return this.http.get(this.getDivisionAPI, this.getHeaders())
  }

  //For all locations based on divison
  getLocations(divisonId) {
    return this.http.get(this.getLocationsAPI + '/' + divisonId, this.getHeaders())
  }

  upsertTarget(targetvalues){
    return this.http.post(this.upsertTargetAPI, targetvalues, this.getHeaders())
  }

  getUserEntitiesList(encryptUserId){

    //let sessionUser = JSON.parse(sessionStorage['Session_name'])
    return this.http.get(this.getUserEntitiesListAPI +'/?userId='+ encryptUserId, this.getHeaders() )
  }

  //For all locations based on divison
  getEntities(locationId) {
    return this.http.get(this.getEntitiesAPI + '/' + locationId, this.getHeaders())
  }

  getTargetTemplate(){
    return this.http.get(this.getTargetTemplateAPI, this.getHeaders())
  }

  getTargetValue(){
    return this.http.get(this.getTargetValueAPI, this.getHeaders())
  }

  getEntityData(data){
    return this.http.post(this.getEntityDataAPI,data, this.getHeaders())
  }


  //For Headers
  getHeaders() {
    let sessionUser = JSON.parse(sessionStorage['Session_name'])
    this.sessiontoken = sessionUser.token;
    this.sessionuser = sessionUser.user_id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorisation': this.sessiontoken,
        'Userid': this.sessionuser
      })
    }
    this.headers = httpOptions;
    return this.headers
  }

  //Manage Users Methods
  insertUserEntities(data){
    return this.http.post(this.insertUserEntitiesAPI, data, this.getHeaders())
  }
  getUserRelatedEntities(userId){
  return this.http.get(this.getUserRelatedEntitiesAPI+'?UserId='+userId, this.getHeaders())
  }
  //For Adding New User
  userUpsert(values) {
    return this.http.post(this.userUpsertAPI, values, this.getHeaders())
  }

  resendMail(values){
    return this.http.post(this.resendMailAPI, values, this.getHeaders())
  }

  //To get the list of Users
  getUsersList() {
    return this.http.get(this.usersListAPI, this.getHeaders())
  }

  getAllEntities(){
    return this.http.get(this.getEntiesListAPI,this.getHeaders())
  }

  //Status value
  userStatus(values) {
    return this.http.post(this.userStatusAPI, values, this.getHeaders())
  }
  // delete User
  deleteUser(Id) {
    return this.http.post(this.deleteRecordAPI, Id, this.getHeaders())
  }


  //Setup Methods

  //For Dimension update and insert
  upsertDimension(values) {
    let sessionUser = JSON.parse(sessionStorage['Session_name'])
    this.sessiontoken = sessionUser.token;
    this.sessionuser = sessionUser.user_id;
    const httpOptions = {
      headers: new HttpHeaders({
        //'enctype': 'multipart/form-data;',
        'Authorisation': this.sessiontoken,
        'Userid': this.sessionuser
      })
    }
    this.headers = httpOptions;
    return this.http.post(this.upsertDimensionAPI, values, this.headers)
  }

  //For inserting and updating KRA
  upsertKRA(values) {
    return this.http.post(this.upsertKraAPI, values, this.getHeaders())
  }

  //For updating and inserting KPI
  upsertKPI(values) {
    return this.http.post(this.upsertKpiAPI, values, this.getHeaders())
  }

  //For Dimension Frequency Dropdown
  getDimensionFrequency() {
    return this.http.get(this.dimensionFrequencyAPI, this.getHeaders())
  }

  //For KPI Datat Type Dropdown
  getKpiDataType() {
    return this.http.get(this.kpiDatattypesAPI, this.getHeaders())
  }
  //Update Analytics
  updateAnalytics(values) {
    return this.http.post(this.updateAnalyticsAPI, values, this.getHeaders())
  }
  // For Setup Tree
  public getSetup(): Observable<any> {
    var EntityDetails = JSON.parse(sessionStorage['EntityDetails'])
    
    return this.http.get(this.getSetupAPI+'?entityId='+EntityDetails.defaultEntityId, this.getHeaders())
  }

  //For deleting Dimension
  deleteDimension(id) {
    return this.http.post(this.deleteDimensionAPI, id, this.getHeaders())
  }

  //For deleting KRA
  deleteKRA(id) {
    return this.http.post(this.deleteKraAPI, id, this.getHeaders())
  }

  //For deleting KPI
  deleteKPI(id) {
    return this.http.post(this.deleteKpiAPI, id, this.getHeaders())
  }
  //Structure Methods

  //Update Organization
  updateOrganization(values) {
    return this.http.post(this.updateOrganizationAPI, values, this.getHeaders())
  }

  //For Adding and updating Division
  upsertDivision(values) {
    return this.http.post(this.upsertDivisionAPI, values, this.getHeaders())
  }
  //For Adding and Updating Location
  upsertLocation(values) {
    return this.http.post(this.locationUpsertAPI, values, this.getHeaders())
  }

  //For Adding and Updating Entity   
  upsertEntity(values) {
    return this.http.post(this.entityUpsertAPI, values, this.getHeaders());
  }

  //For deleting division based on id
  deleteDivision(id) {
    return this.http.post(this.deleteDivisionAPI, id, this.getHeaders());
  }

  //For deleting Location based on id
  deleteLocation(id) {
    return this.http.post(this.deleteLocationAPI, id, this.getHeaders());
  }

  //For deleting entity based on Id
  deleteEntity(id) {
    return this.http.post(this.deleteEntityAPI, id, this.getHeaders());
  }

  //To get all countries
  getCountries(divId, countryId) {
    return this.http.get(this.getCountriesAPI + '?divId=' + divId + '&countryId=' + countryId, this.getHeaders())
  }

  //To get all states based on countries by passing country Id
  getStates(countryId) {
    return this.http.get(this.getStatesAPI + countryId, this.getHeaders())
  }

  //To get all the cities based on states by passing state Id
  getCities(StateId) {
    return this.http.get(this.getCitiesAPI + StateId, this.getHeaders())
  }

  //For structure Tree
  public getstructureJSON(): Observable<any> {
    return this.http.get(this.getStructureAPI, this.getHeaders())
  }

  getDimensionEntity(entityId){
    return this.http.get(this.getDimensionsEntityBasedAPI+"?entityId="+entityId,this.getHeaders())
  }



  public getmarketingJSON(): Observable<any> {
    return this.http.get("../../../assets/marketing.json")
  }

  public gettechnologyJSON(): Observable<any> {
    return this.http.get("../../../assets/technology.json")
  }

  public getsoltionsJSON(): Observable<any> {
    return this.http.get("../../../assets/solutions.json")
  }

  public getprogressJSON(): Observable<any> {
    return this.http.get("../../../assets/progress.json")
  }

  public getinnovationJSON(): Observable<any> {
    return this.http.get("../../../assets/innovation.json")
  }

  public gettalentJSON(): Observable<any> {
    return this.http.get("../../../assets/talent.json")
  }

  public getcultureJSON(): Observable<any> {
    return this.http.get("../../../assets/culture.json")
  }

  public getindustriesJSON(): Observable<any> {
    return this.http.get("../../../assets/industries.json")
  }

  public getalignmentJSON(): Observable<any> {
    return this.http.get("../../../assets/alignment.json")
  }

  public getriskJSON(): Observable<any> {
    return this.http.get("../../../assets/risk.json")
  }

  public getinfrastructureJSON(): Observable<any> {
    return this.http.get("../../../assets/infrastructure.json")
  }

  public getfinanceJSON(): Observable<any> {
    return this.http.get("../../../assets/finance.json")
  }

  public getstatutoryJSON(): Observable<any> {
    return this.http.get("../../../assets/statutory.json")
  }

  public getprojectsJSON(): Observable<any> {
    return this.http.get("../../../assets/projects.json")
  }

  public getqualityJSON(): Observable<any> {
    return this.http.get("../../../assets/quality.json")
  }

  getstructure() {
    return this.http.get('../../../assets/structure.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  getFiles() {
    return this.http.get('../../../assets/setuptree.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  getMarketing() {
    return this.http.get('../../../assets/marketing.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  getTechnology() {
    return this.http.get('../../../assets/technology.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  getSolutions() {
    return this.http.get('../../../assets/solutions.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  getProgress() {
    return this.http.get('../../../assets/progress.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  getInnovation() {
    return this.http.get('../../../assets/innovation.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  getTalent() {
    return this.http.get('../../../assets/talent.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  getCulture() {
    return this.http.get('../../../assets/culture.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  getIndustries() {
    return this.http.get('../../../assets/industries.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  getalignment() {
    return this.http.get('../../../assets/alignment.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  getrisk() {
    return this.http.get('../../../assets/risk.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  getinfrastructure() {
    return this.http.get('../../../assets/infrastructure.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  getfinance() {
    return this.http.get('../../../assets/finance.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  getstatutory() {
    return this.http.get('../../../assets/statutory.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }
  getprojects() {
    return this.http.get('../../../assets/projects.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }
  getquality() {
    return this.http.get('../../../assets/projects.json')
      .toPromise()
      .then(res => <TreeNode[]>res);
  }
}
