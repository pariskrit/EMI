import React from 'react'
import AddSiteDepartmentDialog from 'components/SiteDepartment/AddSiteDepartmentDialog'

export default {
    title: "components/AddSiteDepartment",
    component: AddSiteDepartmentDialog
}

const Template = (args) => <AddSiteDepartmentDialog {...args} />

export const AddModal = Template.bind({})

AddModal.args={
    open: true,
}