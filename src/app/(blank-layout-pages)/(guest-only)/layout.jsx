// HOC Imports
import GuestOnlyRoute from '@/hocs/GuestOnlyRoute';

const Layout = async (props) => {
    const { children } = props;

    // Type guard to ensure lang is a valid Locale

    return <GuestOnlyRoute>{children}</GuestOnlyRoute>;
};

export default Layout;
