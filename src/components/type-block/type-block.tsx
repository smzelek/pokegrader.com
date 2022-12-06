import { h, JSX } from "preact";
import { toShortTypes } from "src/utils"
import { Types } from "src/utils/pokegrader";

const TypeBlock = ({
    type,
    short = true
}: {
    type: Types,
    short?: boolean
}): JSX.Element => {
    return <div className={`type-block ${type}`}>{short ? toShortTypes(type) : type}</div>;
};

export default TypeBlock;