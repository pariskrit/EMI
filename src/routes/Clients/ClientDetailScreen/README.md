### Client Detail Screen Documentation

<br/>

#### Client Detail Page can be divided into 7 different section which are listed below

1. Company Details
2. Company Logo
3. Application
4. Region and Sites
5. Notes
6. Client Documents
7. Key Contacts

These sections has been placed together in grid layout with a card design for which material Grid and Accordian component is being used respectively.
Style guide is properly followed for all the styling. All the Colors, fonts, icons are same as mentioned in the style guide.

<br/>

### Section Details

<br/>

1. Company Details

> It is saved as ClientDetail as mentioned in document. The custom component used is DropDown and others are material ui components. Here, fetching of client detail and patching that detail is done from the given api. Static Options are defined in the Leave Type dropdown.

 <br/>

 - Components used

        1. Grid - Material-UI
        2. Typography - Material-UI
        3. TextField - Material-UI
        4. Accordion - Material-UI
        5. DropDown (Custom from scratch)

 - API used

        1. '/Clients/clientid' (fetching)
        2. '/Client/clientid,[{op:’replace’,path,value}]' (patching on input change)

<br/>
<br/>

2. Company Logo
> This section is used for adding and updating the company logo. Drag and drop component is used for uploading.. React DND is used for drag and drop feature.

<br/>

 - Components used

        1. ErrorDialog: This is used to display error when uploading logo,Made with Material UI components (Dialog,DialogTitle,DialogContent,   DialogActions),custom css using makeStyles of material ui.
		2.DropUploadBox: This is used to drop the dragged files to upload them. This is same as DropUpload but with little changes.
		3.ProviderAsset- Material UI
		4.3.DeleteDialog- Material UI: This dialog opens when the delete icon is clicked of any document.

 - API used

        1. '/Clients/clientid' (fetching)
        2. '/Client/clientid,[{op:’replace’,path,value}]' (patching on input change)

<br/>
<br/>

3. Application
> The fetching, adding and deleting of this section is same as that of Notes. However, when the modal pop ups to add application an api is called ('ClientApplications/clientId/available') which fetches available applications and its is listed in dropdown. One of the application is selected and called post api to post the application. Components used in this section are CurveButton, IOSSwitch, DeleteDialog, Seperate Row Components for each table row data.

<br/>

 - Components used

        1. Accordion - Material UI
        2. Typography - Material UI
        3. Table - Material UI
        4. CurveButton (Custom)
        5. IOSSwitch (Custom for active and inactive)
        6. ClientAppRow (Custom for each table row data)

 - API used

        1. '/clientapplications?clientid=1' (fetching client applicaions)
        2. 'ClientApplications/clientid/available' (fetching available app for client to post)
        3. '/ClientApplications,{applicationId,clientID,isActive:true}' (posting client app)
        4. '/ClientApplications/appId,[{op:’replace’,path:’isActive’,value:’status’}]' (for patching by changing status using IOSSwitch)     

<br/>
<br/>

4. Region and Sites
> This secion is used for adding Region and Sites relative to the specific region. A form inside the Modal is used to add region and sites.

<br/>

 - Components used

        1.CommonAddDialog - Custom component: This dialog opens when the add region or add site button is clicked.It has one input field for name of region or site.
		2.Region - Custom component:This component displays the region name and the list of sites allocated to it.It has add region button which opens the CommonAddDialog component.

 - API used

        1.GET ​/api​/Regions:This is used to fetch region fo single client.This is called when the page loads and when POST /regions and POST /sites operation is successfull.
		2.POST /regions: This is used to save the region name and called when the create button is clicked in CommonAddDialog component.
		3.POST /sites: This is used to save the site name and called when the create button is clicked in CommonAddDialog component.       

<br/>
<br/>

5. Key Contacts
>  This section has only fetched data. So, no such specific custom components used. Only the row section is separately created to for each row data.

<br/>

 - Components used

        1. Table - Material UI
        2. Accordion - Material UI
        3. Typography - Material UI
        4. ClientKeyRow (A seperate row custom components is created for showing each row of table)

 - API used

        1.'/Clients/clientid/keycontacts' (fetching)                  

<br/>
<br/>

6. Client Documents
>  Client Documents section is used for uploading all the necessary client documents. Drag and drop component is used for uploading. React DND is used for drag and drop feature.

<br/>

 - Components used

        1.ErrorDialog- Custom component: This is used to display error when uploading logo.
		2.ProvidedAssetNoImage- Custom component: This component has similar functionalities as ProvidedAsset. The only difference is the image display.
		3.DeleteDialog- Custom component: This dialog opens when the delete icon is clicked of any document.

 - API used

        1.POST /clients/{id}/upload: used to obtain a presigned URL which can then be used to upload the logo to S3.This is called when the file is dropped in the DropUploadBox Component.
		2.POST /clientdocuments: Once a file is uploaded to S3, this end point is called to update the documentKey Property.
		3.DELETE /clientdocuments/{id}: If the delete button is clicked (located to the right of the document), then a pop-up will appear to confirm the deletion of the document. If this has been confirmed, then this endpoint is called to remove the document.
		4.GET ​/api​/ClientDocuments: This endpoint is called when the page loads and when DELETE /clientdocuments/{id} and POST /clientdocuments operation is successfull. It returns the client documents of a single client.                 

<br/>
<br/>

7. Notes
>  Unlike key contacts, this sections also has separate row component for showing each row data. Here DeleteDialog component is used for confirmation modal. A separate component AddNoteDialog modal is created for adding note. Fetching, deleting and adding of data is done in similar way as done in Add Client. A curve button custom components is used which is little modified from material ui button.

<br/>

 - Components used

        1. Table - Material UI
        2. Typography - Material UI
        3. Accordion - Material UI
        4. DeleteDialog, ErrorDialog, AddNoteDialog (Custom Modal)
        5. CurveButton (Custom Button Made from Material ui Button)
        6. ClientNoteRow (Seperate custom row component)

 - API used

        1. '/ClientNotes,{note,clientId}' (posting note)
        2. '/clientnotes?clientid=1' (fetching)
        3. '/ClientNotes/noteid' (using DeleteDialog modal)           
