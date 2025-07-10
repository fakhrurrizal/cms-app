import { CustomTextField } from "@/components"
import { ModalCustom } from "@/components/custom-modal"
import { Grid } from "@mui/material"
import { UseFormReturn } from "react-hook-form"
import { MenuData } from "../schema"
import { Typography } from "@mui/material"

interface Props {
    open: boolean
    toggle: () => void
    isEdit?: boolean
    handleSubmit: () => void
    form: UseFormReturn<MenuData>
}

const ModalMenu = ({ open, toggle, isEdit, handleSubmit, form }: Props) => {

    return (
        <ModalCustom open={open} title={isEdit ? 'Edit Menu' : 'Tambah Menu'} toggle={toggle}
            buttonOkProps={{ children: isEdit ? 'Update' : 'Simpan', onClick: () => handleSubmit() }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CustomTextField control={form.control} name="name" label="Nama Menu" fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <CustomTextField control={form.control} name="icon" label="Icon" fullWidth />

                    <Typography
                        variant="body2"
                        sx={{ mt: 1 }}
                        component="a"
                        href="https://icon-sets.iconify.design/"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                    >
                        Lihat daftar ikon
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <CustomTextField control={form.control}defaultValue={'/'} name="path" label="Path" fullWidth />
                </Grid>
            </Grid>
        </ModalCustom>
    )
}

export default ModalMenu