import AnimationWrapper from "../common/page-animation";

const HomePage =  () => {
    return (
        <AnimationWrapper>
           <section className="h-cover homepage">
            {/* latest blogs */}
            <div className="latest-blog">
                <InPageNavigation></InPageNavigation>

            </div>

            {/* filters and treanding blogs */}
            <div>

            </div>

           </section>
        </AnimationWrapper>
    )
}

export default HomePage;