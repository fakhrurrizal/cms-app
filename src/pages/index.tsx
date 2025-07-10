import { getNavbarLayout } from '@/components'
import { NextPageWithLayout } from '@/utils'
import HomeComponent from '@/view/home'

const HomePage: NextPageWithLayout = () => {
    return (
        <HomeComponent />
    )
}

HomePage.getLayout = getNavbarLayout
export default HomePage