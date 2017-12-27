class StringUtils {
    afterSlash(s: string): string {
        const lastslashindex = s.lastIndexOf('/');
        if (s.length > lastslashindex) {
            return s.substring(lastslashindex + 1);
        } else {
            return '';
        }
    }
}
const stringUtils = new StringUtils();
export default stringUtils as StringUtils;