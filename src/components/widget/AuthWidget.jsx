/**
 * Created by 叶子 on 2017/7/31.
 */
import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
class AuthWidget extends Component {
    static propTypes = {
        childrenfunc: PropTypes.func,
        auth: PropTypes.object
    }
    render() {
        const { childrenfunc, auth } = this.props;
        return childrenfunc(auth.data || {});
    }
}

const mapStateToProps = state => {
    const { auth = {data: {}} } = state.httpData;
    return { auth };
};

export default connect(mapStateToProps)(AuthWidget);