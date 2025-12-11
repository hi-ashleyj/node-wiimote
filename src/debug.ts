export const debugData = (data: number[]) => {
    let out = "[ ";
    let remaining = data;
    
    do {
        const slice = remaining.slice(0, 8);
        remaining = remaining.slice(8);

        const mapped = slice.map(it => "0x" + it.toString(16).padStart(2, "0")).join(", ");
        out += mapped + (remaining.length > 0 ? "\n  " : " ]");

    } while (remaining.length > 0)

    return out;
}