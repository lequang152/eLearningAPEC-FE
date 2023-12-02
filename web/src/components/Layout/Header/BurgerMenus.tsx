import Image from 'next/image';
import { userAuthSelector } from '../../../redux/Selector/userAuthorSelector';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { logOut } from '../../../redux/Slice/Auth/authSlice';

interface BurgerMenusProps {
    setMenuOpen: any;
    menuOpen: any;
}

const BurgerMenus: React.FC<BurgerMenusProps> = ({ setMenuOpen, menuOpen }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [home, setHome] = useState(false);
    const [courses, setcourses] = useState(false);
    const [random, setRandom] = useState(false);
    const [fullTest, setFullTest] = useState(false);
    const userInfo = useSelector(userAuthSelector) || localStorage.getItem('session');
    const pathname = usePathname();
    const router = useRouter();
    const [path, setPath] = useState('');

    useEffect(() => {
        setPath(pathname);
    }, [pathname]);

    const clearLocal = () => {
        localStorage.clear();
        dispatch(logOut());
    };
    const openMobileMenu = (menu: any) => {
        if (menu == 'home') {
            setHome(!home);
            setcourses(false);
            setRandom(false);
            setFullTest(false);
        } else if (menu == 'courses') {
            setHome(false);
            setcourses(!courses);
            setRandom(false);
            setFullTest(false);
        } else if (menu == 'random') {
            setHome(false);
            setcourses(false);
            setRandom(!random);
            setFullTest(false);
        } else if (menu == 'fullTest') {
            setHome(false);
            setcourses(false);
            setRandom(false);
            setFullTest(!fullTest);
        }
    };
    return (
        <div className={`${menuOpen ? 'sidebar__area open' : 'sidebar__area'} min-[1200px]:hidden`}>
            <div className="sidebar__wrapper">
                <div className="sidebar__close">
                    <button className="sidebar__close-btn" id="sidebar__close-btn" onClick={() => setMenuOpen(false)}>
                        <span>
                            <i className="fas fa-times"></i>
                        </span>
                        <span>close</span>
                    </button>
                </div>
                <div className="sidebar__content">
                    <div className="logo mb-40">
                        <Link href="/">
                            <Image src="/assets/img/logo/logoApec.png" alt="logo" width={300} height={339} />
                        </Link>
                    </div>
                    <div className="mm-menu">
                        {userInfo.isAuthenticated ? (
                            <ul>
                                <li>
                                    <Link href="/">Home</Link>
                                </li>

                                {userInfo.isAuthenticated && (
                                    <>
                                        <li>
                                            <Link href="/survey/survey-list">Full Test</Link>
                                        </li>
                                        <li>
                                            <Link
                                                onClick={(e) => {
                                                    clearLocal();
                                                }}
                                                href="/sign-in"
                                            >
                                                Log out
                                            </Link>
                                        </li>
                                    </>
                                )}
                                {!userInfo.isAuthenticated && (
                                    <li>
                                        <Link href="/">Sign-in</Link>
                                    </li>
                                )}
                            </ul>
                        ) : (
                            <ul>
                                <li>
                                    <Link href="/">Home</Link>
                                </li>
                                <li>
                                    <Link href="/sign-in">Sign-in</Link>
                                </li>
                                <li>
                                    <Link href="/sign-up">Sign-up</Link>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BurgerMenus;
