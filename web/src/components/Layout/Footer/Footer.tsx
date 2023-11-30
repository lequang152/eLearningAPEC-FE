import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import FooterBottom from './FooterBottom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import FaxIcon from '@mui/icons-material/Fax';
import EmailIcon from '@mui/icons-material/Email';

const Footer: React.FC = () => {
    return (
        <footer>
            <div className="footer__area footer-bg">
                <div className="footer__top pt-16 pb-4">
                    <div className="px-4 ">
                        <div className="row flex justify-evenly">
                            <div className="col-xxl-2 col-xl-3 col-lg-6 col-md-6 col-sm-6 flex flex-col text-center">
                                <div className="footer__widget mb-50">
                                    <div className="footer__widget-head mb-22 pt-[5px]">
                                        <div className="footer__logo">
                                            <Link
                                                className="flex justify-center pb-2"
                                                style={{
                                                    borderBottom: '2px solid',
                                                    borderColor: '#DEC47F',
                                                }}
                                                href="/"
                                            >
                                                <Image
                                                    width={500}
                                                    height={64}
                                                    src="/assets/img/logo/logoApec.png"
                                                    alt="img not found"
                                                    style={{ width: '70%' }}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="footer__widget-body">
                                        <p>Apec Elearning</p>

                                        <div className="footer__social">
                                            <ul>
                                                <li>
                                                    <Link
                                                        href="https://www.facebook.com/ApecGroupOfficial"
                                                        target="_blank"
                                                    >
                                                        <i className="fab fa-facebook-f"></i>
                                                    </Link>
                                                </li>
                                                {/* <li>
                                                    <Link
                                                        href="#"
                                                        className="tw"
                                                    >
                                                        <i className="fab fa-twitter"></i>
                                                    </Link>
                                                </li> */}
                                                <li>
                                                    <Link
                                                        href="https://www.youtube.com/channel/UCaIGEsD4c2bGwAd40ek3czA"
                                                        className="pin"
                                                    >
                                                        <i className="fab fa-youtube"></i>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xxl-5 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                <div className="footer__widget mb-50">
                                    <div className="footer__widget-head mb-22">
                                        <h3 className="footer__widget-title">Tập đoàn APEC</h3>
                                    </div>
                                    <div className="footer__widget-body">
                                        <div className="footer__link">
                                            <ul>
                                                <li>
                                                    <p>
                                                        <LocationOnIcon color={'warning'} className="mr-1" />
                                                        Địa chỉ: Tầng 3, TTTM Grand Plaza, số 117 Trần Duy Hưng, P.
                                                        Trung Hòa, Q. Cầu Giấy, Hà Nội
                                                    </p>
                                                </li>
                                                <li>
                                                    <p>
                                                        <PhoneIcon
                                                            fontSize="small"
                                                            color={'warning'}
                                                            className="mr-1"
                                                        />
                                                        Điện thoại: 024 3573 0200
                                                    </p>
                                                </li>

                                                <li>
                                                    <p>
                                                        <FaxIcon fontSize="small" color={'warning'} className="mr-1" />
                                                        Fax: 024 3577 1966
                                                    </p>
                                                </li>

                                                <li>
                                                    <p>
                                                        <EmailIcon
                                                            fontSize="small"
                                                            color={'warning'}
                                                            className="mr-1"
                                                        />
                                                        Email: contact@apec.com.vn
                                                    </p>
                                                </li>
                                                <br />
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <FooterBottom />
            </div>
        </footer>
    );
};

export default Footer;
