import axios from 'axios';
import {API_URL, DEFAULT_CHAIN_ID} from "./constants";
import helpers from "./index";
import Swal from "sweetalert2";
import networks from '../network/network.json';


const getProjects = async ({live = 'True', admin, comingSoon} = {}) => {

    let parameters = "?";
    if (live) parameters += `live=${live}&`
    if (admin) parameters += `admin=${admin}&`
    if (comingSoon) parameters += `coming_soon=True&`

    try {
        const {data} = await axios.get(`${API_URL}Project/${parameters}`);
        return data;
    } catch (e) {
        console.log('getProjects error:', e);
    }
}

const _getMainChainId = (marketMakingPool) => {
    return marketMakingPool.network;
}

const getNetworkIcon = (chainId) => {
    const network = networks.filter(network => {
        return network.chainId == chainId;
    })
    return network[0].icon;
}



//@TODO Handle error for market maker settings if no wallet is available
const getProject = async (slug, network = DEFAULT_CHAIN_ID, user_address = "none") => {
    try {
        const {data} = await axios.get(`${API_URL}Project/${slug}/?user_address=${user_address}&network=${network}`);
        const {project, vault, marketMakingPool, UserSettings, liquidityMaker} = data;
        return {project, vault, marketMakingPool, UserSettings, liquidityMaker, mainChainId: _getMainChainId(marketMakingPool)};
    } catch (e) {
        console.log('getProject error:', e);
    }
}


const getProjectServerSide = async (context, user_address = "none") => {
    const {slug} = context.query;
    if (slug !== "undefined") {
        try {
            const {data} = await axios.get(`${API_URL}Project/${slug}/?user_address=${user_address}`);
            const {project, vault, marketMakingPool, liquidityMaker, UserSettings} = data;
            return {
                props: {
                    projectDetail: project, marketMakingPool, vault, liquidityMaker, mainChainId: _getMainChainId(marketMakingPool)
                }
            }
        } catch (e) {
            console.log('getProject error:', e);
            return {
                props: {
                    projectDetail: null, marketMakingPool: null, vault: null, liquidityMaker: null, mainChainId: null
                }
            }
        }
    } else {
        return {
            props: {
                projectDetail: null, marketMakingPool: null, vault: null, mainChainId: null
            },
        };
    }
}


//@TODO Handle error for market maker settings if no wallet is available
const getArticles = async (slug) => {
    try {
        const data = await axios.get(`${API_URL}Article/?project=${slug}`);
        return data
    } catch (e) {
        console.log('getArticles error:', e);
    }
}

const getVestingBatches = async (slug) => {
    try {
        const data = await axios.get(`${API_URL}VestingBatch/?project=${slug}`);
        return data
    } catch (e) {
        console.log('getVestingBatches error:', e);
    }
}

const getVesting = async (id) => {
    try {
        const data = await axios.get(`${API_URL}Vesting/?vesting_batch=${id}`);
        return data
    } catch (e) {
        console.log('getVesting error:', e);
    }
}

const updateProjectInformation = async (formData, projectId, wallet) => {
    const signature = await helpers.web3.authentication.getSignature(wallet);
    formData.append("signature", signature);
    try {
        const response = await axios({
            method: "patch",
            url: `${API_URL}Project/${projectId}/`,
            data: formData,
            headers: {"Content-Type": "multipart/form-data"},
        });
        if (response.status === 200) {
            await Swal.fire({
                position: "center",
                icon: "success",
                title: "Your project has been updated",
                showConfirmButton: false,
                timer: 3000,
            });
        }
    } catch (e) {
        console.log('updateProjectInformation', e);
        throw e;
    }
};


const getVestingData = async (slug) => {
    try {
        return await axios.get(`${API_URL}Project/${slug}/get_vesting_data`);
    } catch (e) {
        console.log('getVestingData error:', e);
    }
}


const getProjectData = async (slug) => {
    try {
        return await axios.get(`${API_URL}Project/${slug}/get_project_data`);
    } catch (e) {
        console.log('getProjectData error:', e);
    }
}

const getTokenomics = async ({ data }) => {
    try {
        return data?.tokenomics;
    } catch (e) {
        console.log('getTokenomics error:', e);
    }
}


const getUserLocations = async (slug) => {
    try {
        return await axios.get(`${API_URL}Project/${slug}/get_user_locations`);
    } catch (e) {
        console.log('getUserLocations error:', e);
    }
}


export default {
    updateProjectInformation,
    getProjects,
    getProject,
    getArticles,
    getProjectServerSide,
    getVestingBatches,
    getVesting,
    getVestingData,
    getProjectData,
    getUserLocations,
    getNetworkIcon,
    getTokenomics
}