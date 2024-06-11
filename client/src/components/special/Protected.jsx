import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { getUserIdAPI } from "../../utility/api";
import { toast } from "sonner";


export default function Protected(props) {
    const { Component } = props;
    const navigate = useNavigate();

    const isLoggedIn = useCallback(async () => {
        const { data } = await getUserIdAPI();
        if (!data.success) {
            toast.warning("Login to continue.")
            navigate(`/login`);
        }
    }, [navigate])

    useEffect(() => {
        isLoggedIn();
    }, [isLoggedIn])

    return (
        <div>
            <Component />
        </div>
    )
}

Protected.propTypes = {
    Component: PropTypes.elementType.isRequired,
};