import Link from 'next/link';

const Footer = () => {
    const ethAddress = '0x0fd87671E7eFcAbEB4Cdef187eEE918453EA7b71';
    const btcAddress = 'bc1qcq6r80uh7vr3z8hgg4mgp8taueqgcncvemukz8';
    const copy = () => {
        navigator.clipboard.writeText(ethAddress);
    };
    return (
        <div className="text-sm ">
            <div className="flex items-center justify-center gap-2">
                <Link
                    href="/data/nawrasmamin.ssh.pub"
                    className="underline decoration-dotted hover:cursor-pointer hover:decoration-solid">
                    AAAAC3NzaC1lZDI1NTE5AAAA <abbr title="Secure Shell">(SSH)</abbr>
                </Link>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm ">
                <div
                    data-href={`bitcoin:${btcAddress}`}
                    data-tip="Click to copy"
                    className="underline sm:tooltip decoration-dotted hover:cursor-pointer hover:decoration-solid"
                    onClick={() => {
                        navigator.clipboard.writeText(`bitcoin:${btcAddress}`);
                    }}>
                    {btcAddress.substring(0, 16)}... <abbr title="Bitcoin">(BTC)</abbr>
                </div>
                <span> - </span>
                <div
                    data-href={`eth:${ethAddress}`}
                    data-tip="Click to copy"
                    className="underline sm:tooltip decoration-dotted hover:cursor-pointer hover:decoration-solid"
                    onClick={() => {
                        navigator.clipboard.writeText(ethAddress);
                    }}>
                    {ethAddress.substring(0, 16)}... <abbr title="Ethereum">(ETH)</abbr>
                </div>
            </div>
            <br></br>
            <div className="text-center">Blog inspired by Portswigger</div>
            <div className="text-center">
                Icons by{' '}
                <Link href="https://simpleicons.org/" className="underline decoration-dotted">
                    SimpleIcons
                </Link>{' '}
                and{' '}
                <Link href="https://fontawesome.com/" className="underline decoration-dotted">
                    FontAwesome
                </Link>
            </div>
        </div>
    );
};

export default Footer;
