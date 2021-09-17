### Sites Screen Documentation

<br/>

#### Sites Screen Page can be divided into 4 different pages which are listed below

1. Site Details
2. Site Assets
3. Site Departments
4. Site Locations

All the pages links has been added in the common NavButtons(components/NavButtons.js) component which will be used for navigation throughout these pages. Besides this we have created a common SiteWrapper(components/SiteWrapper) which has all the common components(NavButtons, Page title, Page status, Last saved date, Add new buttons and etc) that is being used in all these pages.

<br/>

### Page Details

<br/>
1. Site Details Page(/routes/Clients/Sites/SiteDetail)

 <br/>
 <br/>

◦ Site Detail

- Components used

        1. ConfirmChangeDialog(Custom - components/ConfirmChangeDailog)
        2. Grid, Typography, TextField, Accordion (Material UI)
        3. Site Wrapper(Custom - components/SiteWrapper)

- API used

          1. GET /api/sites/${id} (Fetch particular site data)
          2. PATCH /api/sites/{id},{data} (Update site data)
          3. GET /api/Regions/?clientId=${id} (List of regions of the client)
          4. GET /api/Clients/${id} (Called to Get Licence type of client)

  <br/>
  <br/>

◦ Key Contact

- Components used

        1. Accordion box (Custom - components/AccordionBox)
        2. Simple data table (Custom - components/SimpleDataTable)

- API used

           1. GET /api/siteappkeycontacts/Site/{siteId} (Fetch keycontacts of a site)

    <br/>
    <br/>

◦ Applications

- Components used

        1. ConfirmChangeDialog(Custom - components/ConfirmChangeDailog)
        2. Add Site Application Modal (Custom - components/AddSiteApplicationModal)
        3. Accordion box (Custom - components/AccordionBox)
        4. Application Table (Custom- components/ApplicationTable)

- API used

         1. GET /api/siteapps?siteid=${id} (Fetch application of a site)
         2. GET /api/siteapps/{siteId}/available (fetch available applications)
         3. PATCH /api/siteapps/{id},{data} (Update application)
         4. POST /api//siteapps/,{data} (Add application)

<br/>
<br/>
2. Site Assets (/routes/Clients/Sites/SiteAsset)
<br/>
<br/>

- Components used

        1. Site Wrapper (Custom Component with Sitebar and header - components/SiteWrapper)
        2. Client Site Table (Custom Table Component module - components/ClientSiteTable) with Custom Pagination
        3. Delete Dialog (Custom Delete Modal - components/DeleteDailog)
        4. Edit Asset Dialog (Custom Edit Modal - routes/Clients/Sites/SiteAsset/EditAssetDailog)
        5. ContentStyle used for design for search textfield (Material UI)

- API used

        1. GET /api/SiteAssets?siteId=${siteId} (Fetch Site Assets)
        2. GET /api/SiteAssets/Count?siteId=${siteId} (Get total number of site assets)
        3. POST  /api/SiteAssets, {data} (Add new site asset)
        4. DELETE /api/SiteAssets/${siteAssetId} (Delete site asset)
        5. PATCH /api/SiteAssets/${siteAssetId},{data} (Update site asset)
        6. GET /api/SiteAssetReferences?siteAssetId=${siteassetId} (Fetch site asset functional locations/ References)
        7. POST  /api/SiteAssetReferences,{data} (Add new site references for specific site asset)
        8. DELETE /api/SiteAssetReferences/${id} (Delete Reference)
        9. PATCH  /api/SiteAssetReferences/${id},{data} (Update Reference)

<br/>
<br/>
3. Site Departments (/routes/Clients/Sites/SiteDepartment)
<br/>
<br/>

- Components used

        1. Site Wrapper (Custom Component with Sitebar and header - components/SiteWrapper)
        2. Client Site Table (Custom Table Component module - components/ClientSiteTable)
        3. Delete Dialog (Custom Delete Modal - components/DeleteDailog)
        4. Edit Asset Dialog (Custom Edit Modal - routes/Clients/Sites/SiteDepartment/EditModal )
        5. ContentStyle used for design for search textfield (Material UI)
        6. Add Site Department Dialog (components/SiteDepartment/AddSiteDepartmentDialog)

- API used

        1. GET /api/SiteDepartments?siteId=${siteId} (Get all departments for a site)
        2. POST /api/SiteDepartments/${siteId} (Add department)
        3. PATCH /api/SiteDepartments/${siteId} (Update department)
        4. DELETE /api/SiteDepartments/${siteId} (Delete Department)

<br/>
<br/>
4. Site Locations (/routes/Clients/Sites/SiteLocations)
   <br/>
   <br/>

- Components used

        1. Site Wrapper (Custom Component with Sitebar and header - components/SiteWrapper)
        2. Client Site Table (Custom Table Component module - components/ClientSiteTable)
        3. Delete Dialog (Custom Delete Modal - components/DeleteDailog)
        4. Edit Dialog Modal (Custom Edit Modal - routes/Clients/Sites/SiteLocations/EditModal)
        5. ContentStyle used for design for search textfield (Material UI)
        6. Add Site Location Dialog (components/SiteLocations/AddSiteLocationsDialog)

- API used

        1. GET /api/SiteLocations?siteId=${siteId} (Get all locations for a site)
        2. POST /api/SiteLocations/${siteId} (Add locations)
        3. PATCH /api/SiteLocations/${siteId} (Update locations)
        4. DELETE /api/SiteLocations/${siteId} (Delete locations)
