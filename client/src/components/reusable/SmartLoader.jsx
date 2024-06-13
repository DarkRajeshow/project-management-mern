import PropTypes from 'prop-types';


export default function SmartLoader({ className = "h-[80vh]" }) {
    return (
        <div className={`w-full flex items-center justify-center ${className}`}>
            <div className='w-10 h-10 border-2 animate-spin rounded-full border-t-transparent border-white'/>
        </div>
    )
}


SmartLoader.propTypes = {
    className: PropTypes.elementType,
};