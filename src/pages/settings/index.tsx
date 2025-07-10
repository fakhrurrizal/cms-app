import { getNavbarLayout } from '@/components'
import { NextPageWithLayout } from '@/utils'
import SettingsMenuView from '@/view/settings'

const SettingsMenuPage: NextPageWithLayout = () => {
    return (
        <>
            <SettingsMenuView />
        </>
    )
}

SettingsMenuPage.getLayout = getNavbarLayout
export default SettingsMenuPage

