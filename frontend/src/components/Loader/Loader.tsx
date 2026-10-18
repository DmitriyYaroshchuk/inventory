import './Loader.scss';

const Loader = () => (
    <div className="loader">
        <div className="spinner-border loader__spinner" role="status">
            <span className="visually-hidden">Загрузка...</span>
        </div>
    </div>
);

export default Loader;