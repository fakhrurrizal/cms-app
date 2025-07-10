import { CustomTextField } from "@/components"
import { ModalCustom } from "@/components/custom-modal"
import { Grid } from "@mui/material"
import { UseFormReturn } from "react-hook-form"
import { GroupData } from "../schema"

interface Props {
    open: boolean
    toggle: () => void
    isEdit?: boolean
    handleSubmit: () => void
    form: UseFormReturn<Omit<GroupData, 'menus'>>
}

const ModalGroup = ({ open, toggle, isEdit, handleSubmit, form }: Props) => {

    return (
        <ModalCustom open={open} title={isEdit ? 'Edit Grup Menu' : 'Tambah Grup Menu'} toggle={toggle}
            buttonOkProps={{ children: isEdit ? 'Update' : 'Simpan', onClick: () => handleSubmit() }}
        >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <CustomTextField control={form.control} name="name" label="Nama Grup" fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <CustomTextField
                        control={form.control}
                        name="description"
                        label="Deskripsi"
                        multiline
                        rows={3}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </ModalCustom>
    )
}

export default ModalGroup