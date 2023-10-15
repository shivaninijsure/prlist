import React from 'react';
import './ListingScreen.css';
import axios from "axios";
import { FaComment } from 'react-icons/fa';
import Loader from "react-js-loader";
import ReactPaginate from 'react-paginate';

const headers = {
    'Accept': 'application/vnd.github+json',
    'Authorization': 'Bearer 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',
    'X-GitHub-Api-Version': '2022-11-28'
}
class ListingScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoader: true,
            listing: [],
            perPage: 20, // Setting Per Page Count to 20
            pageCount: 0 // Setting it to 0 but will be set by total open PRs
        }
    }

    componentDidMount = () => {
        // Calling First Page on Component Mounting
        this.getPRList(1);
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        this.getPRList(selectedPage + 1);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    getPRList = async (currentPage) => {
        this.setState({ isLoader: true })
        console.log(currentPage);

        const listResponse = await axios.get(`https://api.github.com/search/issues?q=is:pr%20state:open%20repo:facebook/react&per_page=20&page=${currentPage}`, {
            headers: headers
        });

        this.setState({ pageCount: Math.ceil(listResponse.data.total_count / 20) });


        const listing = await Promise.all(listResponse.data.items.map((d) => this.getDetails(d.title.toUpperCase(), d.user.url, d.comments_url)));

        this.setState({ listing: listing });

        this.setState({ isLoader: false })
    }

    async getDetails(title, authorUrl, commentsUrl) {
        let item = {};
        await axios.all(
            [
                axios.get(authorUrl, {
                    headers: headers
                }),
                axios.get(commentsUrl, {
                    headers: headers
                })
            ]).then(axios.spread((res1, res2) => {
                item.title = title;
                item.author = res1.data.name;
                item.commentsCount = res2.data.length;
            })).catch(error => { console.log(error) })
        return item;
    }


    render() {

        return (
            <div className='listingScreen'>
                <p>NS1 Portal Take Home Screener - Open PR List for Facebook</p>

                {this.state.isLoader ?
                    <div className='loaderStyle'>
                        <Loader type="spinner-circle" bgColor={"#222222"} color={'#222222'} size={'70cqmin'} />
                    </div>
                    :

                    <div>
                        {this.state.listing.map((data, index) =>
                            <div className='ItemContainer' key={index}>

                                <div className='dataContainer'>
                                    <span className='nameStyle'>{data.title}</span>
                                    <span className='authName'>{data.author}</span>
                                </div>
                                <div className='iconContainer'>
                                    <FaComment size={'3cqmin'} color='#222222' />
                                    <span className='countStyle'>{data.commentsCount}</span>
                                </div>

                            </div>
                        )}
                    </div>
                }

                <div className='paginationContainer'>
                    <ReactPaginate
                        previousLabel={"prev"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={this.state.pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={10}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} />
                </div>
                
            </div>
        );

    }
}
export default ListingScreen;
