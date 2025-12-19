import {Container, CssBaseline, Toolbar, Typography} from "@mui/material"

export const Layout: React.FC<{children: React.ReactNode}> = ({children}) => {
    return (
        <>
            <CssBaseline />
            <Toolbar sx={{borderBottom: 1, borderColor: "divider"}}>
                <Typography variant="h6" component={"div"} sx={{flexGrow: 1}}>
                    EventHub
                </Typography>
            </Toolbar>
            <Container maxWidth="lg" sx={{mt: 4}}>
                {children}
            </Container>
        </>
    )
}