import React, { Component } from "react";import { FaDiscord, FaInstagram, FaLinkedin } from "react-icons/fa";
import { config } from "../config";
import SocialIcon from "./SocialIcon";

export default class MainFooter extends Component {
  render() {
    return (
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4 items-center justify-center text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-400 text-center">
            <div>
              <h3 className="text-xl font-bold text-yellow-500 mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/events"
                    className="hover:text-yellow-500 transition-colors"
                  >
                    Events
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-500 mb-4">
                Contact Us
              </h3>
              <p>Send your ravens to:</p>
              <a
                href="mailto:emufrpclub@gmail.com"
                className="text-yellow-500 hover:text-yellow-400"
              >
                emufrpclub@gmail.com
              </a>
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-500 mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4 text-center items-center justify-center">
                <SocialIcon icon={<FaDiscord />} href={config.DISCORD_LINK} />
                <SocialIcon
                  icon={<FaInstagram />}
                  href={config.INSTAGRAM_LINK}
                />
                <SocialIcon icon={<FaLinkedin />} href={config.LINKEDIN_LINK} />
              </div>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500">
            <p>{config.FOOTER_TEXT}</p>
          </div>
        </div>
      </footer>
    );
  }
}
