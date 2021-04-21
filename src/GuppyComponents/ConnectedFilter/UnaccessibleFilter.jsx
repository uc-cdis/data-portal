import ConnectedFilter from '.';
import { ENUM_ACCESSIBILITY } from '../Utils/const';

class UnaccessibleFilter extends ConnectedFilter {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      accessibility: ENUM_ACCESSIBILITY.UNACCESSIBLE,
    };
  }
}

export default UnaccessibleFilter;
